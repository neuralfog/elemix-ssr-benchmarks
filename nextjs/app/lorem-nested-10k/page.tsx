import { LOREM, LoremNested } from '@/components/LoremNested';
import list from '@/components/loremList.module.css';

export const dynamic = 'force-dynamic';

export default function Page() {
    return (
        <div className={list.lorem}>
            <LoremNested index={0} text={LOREM} depth={10000} />
        </div>
    );
}
