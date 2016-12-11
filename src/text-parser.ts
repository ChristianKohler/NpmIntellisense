import { TextDocument, Position } from 'vscode';

export function getCurrentLine(document: TextDocument, position: Position): string {
    return document.getText(document.lineAt(position).range);
}

export function getTextWithinString(text: string, position: number): string {
    const textToPosition = text.substring(0, position);
    const quoatationPosition = Math.max(textToPosition.lastIndexOf('\"'), textToPosition.lastIndexOf('\''));
    return quoatationPosition != -1 ? textToPosition.substring(quoatationPosition + 1, textToPosition.length) : undefined;
}