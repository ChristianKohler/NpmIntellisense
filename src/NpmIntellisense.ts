import { CompletionItemProvider, TextDocument, Position, CompletionItem, CompletionItemKind, workspace } from 'vscode'
import { readFile } from 'fs';
import { join } from 'path';

const packageJson = join(workspace.rootPath, 'package.json');
const scanDevDependencies = workspace.getConfiguration('npm-intellisense')['scanDevDependencies'];

export class NpmIntellisense implements CompletionItemProvider {
    provideCompletionItems(document: TextDocument, position: Position): Thenable<CompletionItem[]> {
        if (!this.shouldProvide(document, position)) { return Promise.resolve([]) } 
        return this.getNpmPackages().then(dependencies => dependencies.map(d => this.toCompletionItem(d)));
    }
    
    getNpmPackages() {
        return this.readFilePromise(packageJson)
            .then(config => [
                ...Object.keys(config.dependencies || {}), 
                ...Object.keys(scanDevDependencies ? config.devDependencies || {} : {})
                ])
            .catch(() => []);
    }
    
    readFilePromise(file) {
        return new Promise<any>((resolve, reject) => {
            readFile(file, (err, data) => err ? reject(err) : resolve(JSON.parse(data.toString())));
        });
    }
    
    toCompletionItem(dep: string) {
        let item = new CompletionItem(dep);
        item.kind = CompletionItemKind.Module;
        return item;
    }
    
    shouldProvide(document: TextDocument, position: Position) {
        const line = document.getText(document.lineAt(position).range);
        return (
            this.isImportOrRequire(line, position.character) &&
            !this.startsWithADot(line, position.character)
        ); 
    }
    
    isImportOrRequire(line: string, position: number): boolean {
        let isImport = line.substring(0, 6) === 'import';
        let isRequire = line.indexOf('require(') != -1;
        return (isImport && this.isAfterFrom(line, position)) || isRequire;
    }

    isAfterFrom(line: string, position: number) {
        let fromPosition = this.stringMatches(line, [
            ' from \'', ' from "',
            '}from \'', '}from "'
        ]);

        return fromPosition != -1 && fromPosition < position;
    }

    private stringMatches(line: string, strings: string[]): number {
        return strings.reduce((position, str) => {
            return Math.max(position, line.lastIndexOf(str));
        }, -1);
    }

    startsWithADot(text: string, position: number) {
        const textWithinString = this.getTextWithinString(text, position);

        if (!textWithinString || textWithinString.length === 0) {
            return false;
        }

        return textWithinString[0] === '.';
    }

    getTextWithinString(text: string, position: number) {
        const textToPosition = text.substring(0, position);
        const quoatationPosition = Math.max(textToPosition.lastIndexOf('\"'), textToPosition.lastIndexOf('\''));
        return quoatationPosition != -1 ? textToPosition.substring(quoatationPosition + 1, textToPosition.length) : undefined;
    }
}