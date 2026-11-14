import { LOREM, LoremParagraph } from '@/components/LoremParagraph';

export const dynamic = 'force-dynamic';

export default function Page() {
    const items = Array.from({ length: 10000 }, (_, i) => i);
    return (
        <div className="lorem">
            {items.map((i) => (
                <LoremParagraph key={i} index={i} text={LOREM} />
            ))}
        </div>
    );
}
