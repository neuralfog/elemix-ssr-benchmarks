import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = join(import.meta.dir, '..');
const ART = join(ROOT, 'artifacts');
const HTML = join(import.meta.dir, 'index.html');
const PORT = 4000;

Bun.serve({
    port: PORT,
    fetch(req) {
        const url = new URL(req.url);
        if (url.pathname === '/api/results') {
            let files: string[] = [];
            try {
                files = readdirSync(ART).filter((f) => f.endsWith('.json'));
            } catch {}
            const data = files.map((f) =>
                JSON.parse(readFileSync(join(ART, f), 'utf8')),
            );
            return Response.json(data);
        }
        return new Response(readFileSync(HTML), {
            headers: { 'content-type': 'text/html; charset=utf-8' },
        });
    },
});

console.log(`Dashboard → http://localhost:${PORT}`);
