import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const PORT = 3000;
const BASE = `http://localhost:${PORT}`;
const WARMUP = 5;
const REPS = 20;
const READY_TIMEOUT_MS = 240_000;
const REQ_TIMEOUT_MS = 60_000;

// nested-10k is the stack-killer (crashes Vue/Next SSR) — run it LAST so a
// crash only costs that one page, not the whole framework's data.
const PAGES = [
    'lorem-1k',
    'lorem-10k',
    'lorem-nested-1k',
    'lorem-styled-1k',
    'lorem-styled-10k',
    'lorem-nested-10k',
];

type Framework = { name: string; dir: string; cmd: string };

const FRAMEWORKS: Framework[] = [
    { name: 'asp', dir: 'asp', cmd: 'make ssr' },
    { name: 'hydris', dir: 'hydris', cmd: 'dotnet hydris ssr' },
    { name: 'nextjs', dir: 'nextjs', cmd: 'bun run ssr' },
    { name: 'nuxt', dir: 'nuxt', cmd: 'bun run ssr' },
];

const ROOT = import.meta.dir;
const OUT = join(ROOT, 'artifacts');

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function sh(cmd: string): string {
    return Bun.spawnSync(['bash', '-c', cmd]).stdout.toString().trim();
}

function listenPid(): number | null {
    const out = sh(
        `ss -ltnpH 'sport = :${PORT}' 2>/dev/null | grep -oP 'pid=\\K[0-9]+' | head -1`,
    );
    const pid = Number.parseInt(out, 10);
    return Number.isFinite(pid) && pid > 0 ? pid : null;
}

function killPort(): void {
    sh(
        `ss -ltnpH 'sport = :${PORT}' 2>/dev/null | grep -oP 'pid=\\K[0-9]+' | sort -u | xargs -r kill -9`,
    );
}

function rssMB(pid: number): number {
    try {
        const s = readFileSync(`/proc/${pid}/status`, 'utf8');
        const m = s.match(/VmRSS:\s+(\d+)\s+kB/);
        return m ? Number.parseInt(m[1], 10) / 1024 : 0;
    } catch {
        return 0;
    }
}

function stats(samples: number[]) {
    const s = [...samples].sort((a, b) => a - b);
    const n = s.length;
    const mean = s.reduce((a, b) => a + b, 0) / n;
    const variance = s.reduce((a, b) => a + (b - mean) ** 2, 0) / n;
    const q = (p: number) => s[Math.min(n - 1, Math.floor(p * (n - 1)))];
    return {
        min: s[0],
        max: s[n - 1],
        median: q(0.5),
        mean,
        p95: q(0.95),
        stddev: Math.sqrt(variance),
    };
}

async function timeRequest(path: string): Promise<{ ms: number; bytes: number }> {
    const t0 = performance.now();
    const r = await fetch(`${BASE}/${path}`, {
        signal: AbortSignal.timeout(REQ_TIMEOUT_MS),
    });
    const body = await r.arrayBuffer();
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return { ms: performance.now() - t0, bytes: body.byteLength };
}

async function waitReady(): Promise<boolean> {
    const t0 = Date.now();
    while (Date.now() - t0 < READY_TIMEOUT_MS) {
        try {
            const r = await fetch(`${BASE}/${PAGES[0]}`, {
                signal: AbortSignal.timeout(2000),
            });
            if (r.ok) {
                await r.arrayBuffer();
                return true;
            }
        } catch {}
        await sleep(500);
    }
    return false;
}

async function benchFramework(fw: Framework) {
    console.log(`\n=== ${fw.name} ===`);
    killPort();

    const proc = Bun.spawn(['bash', '-c', fw.cmd], {
        cwd: join(ROOT, fw.dir),
        stdout: 'inherit',
        stderr: 'inherit',
        stdin: 'ignore',
    });

    const pages: Record<string, unknown> = {};
    let idleRss = 0;
    let peakRss = 0;
    let status = 'ok';
    let sampler: ReturnType<typeof setInterval> | null = null;

    try {
        console.log(`  building + starting (${fw.cmd}) ...`);
        if (!(await waitReady())) {
            console.log(`  ✗ never came up on :${PORT}`);
            status = 'no-start';
            for (const p of PAGES) pages[p] = { crashed: true };
            return;
        }
        const pid = listenPid();
        console.log(`  up on :${PORT} (pid ${pid})`);
        peakRss = idleRss = pid ? rssMB(pid) : 0;
        sampler = setInterval(() => {
            const p = listenPid();
            if (p) peakRss = Math.max(peakRss, rssMB(p));
        }, 25);

        let dead = false;
        for (const page of PAGES) {
            if (dead) {
                pages[page] = { crashed: true };
                continue;
            }
            const samples: number[] = [];
            let bytes = 0;
            let crashed = false;
            try {
                for (let i = 0; i < WARMUP; i++) await timeRequest(page);
                for (let i = 0; i < REPS; i++) {
                    const { ms, bytes: b } = await timeRequest(page);
                    samples.push(ms);
                    bytes = b;
                }
            } catch (e) {
                crashed = true;
                if (listenPid() === null) {
                    dead = true;
                    status = 'partial';
                }
                console.log(`  ⚠ ${page} crashed (${(e as Error).message})`);
            }
            if (samples.length > 0) {
                pages[page] = {
                    samples,
                    ...stats(samples),
                    bytes,
                    ...(crashed ? { crashed: true, completed: samples.length } : {}),
                };
                const st = stats(samples);
                console.log(
                    `  ${page.padEnd(18)} median ${st.median.toFixed(2)}ms  p95 ${st.p95.toFixed(2)}ms  ${(bytes / 1024).toFixed(0)}KB${crashed ? ' (partial)' : ''}`,
                );
            } else {
                pages[page] = { crashed: true };
                console.log(`  ${page.padEnd(18)} CRASHED (no samples)`);
            }
        }
        console.log(
            `  memory: idle ${idleRss.toFixed(1)}MB  peak ${peakRss.toFixed(1)}MB  [${status}]`,
        );
    } finally {
        if (sampler) clearInterval(sampler);
        const pid = listenPid();
        if (pid) {
            try {
                process.kill(pid, 'SIGKILL');
            } catch {}
        }
        try {
            proc.kill(9);
        } catch {}
        killPort();
        writeFileSync(
            join(OUT, `${fw.name}.json`),
            JSON.stringify(
                {
                    framework: fw.name,
                    ranAt: new Date().toISOString(),
                    status,
                    memory: {
                        idleRssMB: Number(idleRss.toFixed(1)),
                        peakRssMB: Number(peakRss.toFixed(1)),
                    },
                    pages,
                },
                null,
                2,
            ),
        );
        console.log(`  → artifacts/${fw.name}.json [${status}]`);
        await sleep(1500);
    }
}

mkdirSync(OUT, { recursive: true });
const only = process.argv[2];
const list = only ? FRAMEWORKS.filter((f) => f.name === only) : FRAMEWORKS;
for (const fw of list) {
    try {
        await benchFramework(fw);
    } catch (e) {
        console.log(`✗ ${fw.name} harness error: ${(e as Error).message}`);
    }
}
console.log('\nDone. Artifacts in artifacts/');
