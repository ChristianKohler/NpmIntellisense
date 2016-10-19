import { CompletionItem, CompletionItemKind, TextDocument, TextEdit, Position, Range } from 'vscode';
import { getCurrentLine } from './text-parser';

export default class PackageCompletionItem extends CompletionItem {  
  constructor(label: string, document: TextDocument, position: Position) {
    super(label);
    this.kind = CompletionItemKind.Module;
    
    const editRange = this.importStringRange(document, position);
    this.textEdit = TextEdit.replace(editRange, label);
  }

  importStringRange(document: TextDocument, position: Position): Range {
    const line = getCurrentLine(document, position);
    const textToPosition = line.substring(0, position.character - 1);
    const quoatationPosition = Math.max(textToPosition.lastIndexOf('\"'), textToPosition.lastIndexOf('\''));
    
    const startPosition = new Position(position.line, quoatationPosition + 1);
    const endPosition = position;
    
    return new Range(startPosition, endPosition);
  }
}