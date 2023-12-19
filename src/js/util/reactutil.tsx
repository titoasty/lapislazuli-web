import { Fragment } from 'react';

export function splitNewlines(
    text: string,
    cb = (part: string, idx: number, arr: string[]) =>
        part && part.trim().length > 0 ? (
            <Fragment key={idx}>
                <span>{part}</span>
                {idx < arr.length - 1 && <br />}
            </Fragment>
        ) : (
            <br key={idx} />
        )
) {
    return text
        .replace(/\\n/g, '\n')
        .replace(/\<br\/\>/g, '\n')
        .split('\n')
        .map((part: string, idx: number, arr: string[]) => cb(part, idx, arr));
}

export function splitChars(text: string) {
    return text.split('').map((c: string, i: number) => <span key={i}>{c === ' ' ? '\u00A0' : c}</span>);
}

interface SplitWordsCharsOptions {
    key?: string;
    processLetter?: (letter: string) => string;
    getLetterClass?: (letter: string) => string;
}

export function splitWordsChars(text: string, options: SplitWordsCharsOptions = {}) {
    return text.split(' ').map((str, idx, arr) => {
        return (
            <Fragment key={options.key}>
                <span data-type="word">
                    {str.split('').map((c: string, i: number) => (
                        <span key={i} data-type="char" className={options.getLetterClass?.(c)}>
                            {c === ' ' ? '\u00A0' : options.processLetter ? options.processLetter(c) : c}
                        </span>
                    ))}
                </span>
                {idx < arr.length - 1 && <span data-type="char">{'\u00A0'}</span>}
            </Fragment>
        );
    });
}

export const preventDefault = (event: Event) => event.preventDefault();
