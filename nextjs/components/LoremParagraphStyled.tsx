import styles from './LoremParagraphStyled.module.css';

export const LOREM =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

export function LoremParagraphStyled({
    index,
    text,
}: {
    index: number;
    text: string;
}) {
    return (
        <p className={styles.para}>
            {index}: {text}
        </p>
    );
}
