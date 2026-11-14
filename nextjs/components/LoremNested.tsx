import styles from './LoremParagraphStyled.module.css';

export const LOREM =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

export function LoremNested({
    index,
    text,
    depth,
}: {
    index: number;
    text: string;
    depth: number;
}) {
    return (
        <div>
            <p className={styles.para}>
                {index}: {text}
            </p>
            {depth > 1 && (
                <LoremNested index={index + 1} text={text} depth={depth - 1} />
            )}
        </div>
    );
}
