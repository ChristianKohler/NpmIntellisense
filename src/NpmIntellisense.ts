import { CompletionItemProvider, TextDocument, Position, CompletionItem, CompletionItemKind, workspace } from 'vscode';
import { readFile } from 'fs';
import { join } from 'path';
import { localPackages } from './local';

const packageJson = join(workspace.rootPath, 'package.json');
const tsConfigJson = join(workspace.rootPath, 'tsconfig.json');
const scanDevDependencies = workspace.getConfiguration('npm-intellisense')['scanDevDependencies'];

export class NpmIntellisense implements CompletionItemProvider {
    provideCompletionItems(document: TextDocument, position: Position): Thenable<CompletionItem[]> {
        const line = document.getText(document.lineAt(position).range);
        if (!this.isImportOrRequire(line)) {
            return Promise.resolve([]);
        }

        const text = this.getTextWithinString(line, position.character);
        const searchLocal = text.startsWith('.');
        const searchGlobal = !text && !searchLocal;

        const all: CompletionItem[] = [];
        function add(items: CompletionItem[]): CompletionItem[] {
            items.forEach(it => all.push(it));
            return all;
        }

        return this.readFilePromise(packageJson).then(config => {
            let p: Promise<CompletionItem[]> = Promise.resolve(all);
            if (searchLocal) {
                const locals = tsConfigOrErr => localPackages(workspace.rootPath, document.fileName, text, tsConfigOrErr.exclude).then(add);
                p = this.readFilePromise(tsConfigJson)
                    .then(locals)
                    .catch(locals);
            }
            if (searchGlobal) {
                p = p.then(() => Promise.resolve(add(this.getNpmPackages(config).map(d => this.toCompletionItem(d)))));
            }

            return p;
        });
    }

    getNpmPackages(config) {
        return [
            ...Object.keys(config.dependencies || {}),
            ...Object.keys(scanDevDependencies ? config.devDependencies || {} : {})
        ];
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

    isImportOrRequire(line: string) {
        let isImport = line.substring(0, 6) === 'import';
        let isRequire = line.indexOf('require(') != -1;
        return isImport || isRequire;
    }

    getTextWithinString(line: string, position: number) {
        const textToPosition = line.substring(0, position);
        const quoatationPosition = Math.max(textToPosition.lastIndexOf('\"'), textToPosition.lastIndexOf('\''));
        return quoatationPosition != -1 ? textToPosition.substring(quoatationPosition + 1, textToPosition.length) : undefined;
    }
}