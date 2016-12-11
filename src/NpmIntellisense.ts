import { CompletionItemProvider, TextDocument, Position, CompletionItem, CompletionItemKind, workspace } from 'vscode'
import { readFile, readdir, statSync } from 'fs';
import { join, resolve as pathResolve, dirname as pathDir } from 'path';
import { getTextWithinString, getCurrentLine } from './text-parser';
import PackageCompletionItem from './PackageCompletionItem';

const split = ( p:string ) => {
    return p.split('/');
};

const packageJson = join(workspace.rootPath, 'package.json');
const scanDevDependencies = workspace.getConfiguration('npm-intellisense')['scanDevDependencies'];
const recursivePackageJsonLookup = workspace.getConfiguration('npm-intellisense')['recursivePackageJsonLookup'];

function nearestPackageFile(currentPath: string): string {
    const rootDir = workspace.rootPath;
    const maybePackageJson = join(currentPath, 'package.json');
    
    if (rootDir === currentPath) {
        return maybePackageJson;
    }

    try {
        const packageStat = statSync(maybePackageJson);
        if (packageStat.isFile()) {
            return maybePackageJson;
        }
    } catch (err) {
        // no-op
    }

    return nearestPackageFile(pathResolve(currentPath, '..'));
}

export class NpmIntellisense implements CompletionItemProvider {
    provideCompletionItems(document: TextDocument, position: Position): Thenable<CompletionItem[]> {
        if (!this.shouldProvide(document, position)) { return Promise.resolve([]) } 
        return this.getNpmPackages()
            .then(dependencies => {
                let fragments:Array<string> = document.lineAt(position).text.split('from '),
                    pkgFragment:string = fragments[fragments.length-1].split(/['"]/)[1],
                    packageName:string = split(pkgFragment)[0];

                if (dependencies.filter(dep => dep === packageName).length) {
                    let path:string = join(workspace.rootPath, 'node_modules', ...split(pkgFragment));
                    return new Promise<any>(( resolve, reject ) => {
                        readdir(path, ( error, files ) => {
                            if (error) {
                                reject(error);
                            } else {
                                resolve(files.map(file => file.replace(/\.js$/, '')));
                            }
                        });
                    })

                }

                return dependencies;
            })
            .then(items => items.map(d => this.toCompletionItem(d, document, position)));
    }
    
    getNpmPackages(document: TextDocument) {
        const packageFile = recursivePackageJsonLookup ? 
            nearestPackageFile(pathDir(document.fileName)) :
            packageJson;

        return this.readFilePromise(packageFile)
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
    
    toCompletionItem(dep: string, document: TextDocument, position: Position) {
        return new PackageCompletionItem(dep, document, position);
    }
    
    shouldProvide(document: TextDocument, position: Position) {
        const line = getCurrentLine(document, position);
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
        const textWithinString = getTextWithinString(text, position);

        if (!textWithinString || textWithinString.length === 0) {
            return false;
        }

        return textWithinString[0] === '.';
    }
}