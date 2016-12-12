import { CompletionItemProvider, TextDocument, Position, CompletionItem, CompletionItemKind, workspace } from 'vscode'
import { readFile, readdir, statSync } from 'fs';
import { join, resolve as pathResolve, dirname as pathDir } from 'path';
import { PackageCompletionItem } from './PackageCompletionItem';
import { getConfig, Config } from './config';
import { shouldProvide } from './shouldProvide';
import { provide } from './provide';
import { State } from './State';
import { fsf } from './fs-functions';

const split = ( p:string ) => p.split('/');

export class NpmIntellisense implements CompletionItemProvider {
    provideCompletionItems(document: TextDocument, position: Position): Thenable<CompletionItem[]> {
        
        const state : State = {
            rootPath: workspace.rootPath,
            filePath: pathDir(document.fileName),
            textCurrentLine: document.lineAt(position).text,
            cursorPosition: position.character,
            cursorLine: position.line
        };

        return shouldProvide(state) ? provide(state, getConfig(), fsf) : Promise.resolve([])

        // if (!shouldProvide(state)) { return Promise.resolve([]) } 

        // return this.getNpmPackages(getConfig(), document.fileName)
        //     .then(dependencies => {
        //         let fragments:Array<string> = document.lineAt(position).text.split('from '),
        //             pkgFragment:string = fragments[fragments.length-1].split(/['"]/)[1],
        //             packageName:string = split(pkgFragment)[0];

        //         if (dependencies.filter(dep => dep === packageName).length) {
        //             let path:string = join(workspace.rootPath, 'node_modules', ...split(pkgFragment));
        //             return new Promise<any>(( resolve, reject ) => {
        //                 readdir(path, ( error, files ) => {
        //                     if (error) {
        //                         reject(error);
        //                     } else {
        //                         resolve(files.map(file => file.replace(/\.js$/, '')));
        //                     }
        //                 });
        //             })

        //         }

        //         return dependencies;
        //     })
        //     .then(items => items.map(d => this.toCompletionItem(d, document, position)));
    }
    
    // toCompletionItem(dep: string, document: TextDocument, position: Position) {
    //     return new PackageCompletionItem(dep, document, position);
    // }
}