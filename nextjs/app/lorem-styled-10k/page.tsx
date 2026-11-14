import list from '@/components/loremList.module.css';
import { LOREM, LoremParagraphStyled } from '@/components/LoremParagraphStyled';

export const dynamic = 'force-dynamic';

export default function Page() {
    const items = Array.from({ length: 10000 }, (_, i) => i);
    return (
        <div className={list.lorem}>
            {items.map((i) => (
                <LoremParagraphStyled key={i} index={i} text={LOREM} />
            ))}
        </div>
    );
}
