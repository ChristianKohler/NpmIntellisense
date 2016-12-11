import { State } from './State';

export function shouldProvide(state: State) {
    return isImportOrRequire(state.textCurrentLine, state.cursorPosition)
        && !startsWithADot(state.textCurrentLine, state.cursorPosition);
}

function isImportOrRequire(textCurrentLine: string, position: number): boolean  {
    let isImport = textCurrentLine.substring(0, 6) === 'import';
    let isRequire = textCurrentLine.indexOf('require(') != -1;
    return (isImport && isAfterFrom(textCurrentLine, position)) || isRequire;
}

function isAfterFrom(textCurrentLine: string, position: number) {
    let fromPosition = stringMatches(textCurrentLine, [
        ' from \'', ' from "',
        '}from \'', '}from "'
    ]);

    return fromPosition != -1 && fromPosition < position;
}

function stringMatches(textCurrentLine: string, strings: string[]): number {
    return strings.reduce((position, str) => {
        return Math.max(position, textCurrentLine.lastIndexOf(str));
    }, -1);
}

function startsWithADot(textCurrentLine: string, position: number) {
    const textWithinString = getTextWithinString(textCurrentLine, position);
    return textWithinString 
        && textWithinString.length > 0 
        && textWithinString[0] === '.';
}

function getTextWithinString(text: string, position: number): string {
    const textToPosition = text.substring(0, position);
    const quoatationPosition = Math.max(textToPosition.lastIndexOf('\"'), textToPosition.lastIndexOf('\''));
    return quoatationPosition != -1 ? textToPosition.substring(quoatationPosition + 1, textToPosition.length) : undefined;
}