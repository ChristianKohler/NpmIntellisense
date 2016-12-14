import { State } from './State';
import { Config } from './config';
import { fsf, FsFunctions } from './fs-functions';
import { join, resolve } from 'path';
import { CompletionItem } from 'vscode';
import { PackageCompletionItem } from './PackageCompletionItem';
import * as repl from 'repl';

export function provide(state: State, config: Config, fsf: FsFunctions): Promise<CompletionItem[]> {
    return getNpmPackages(state, config, fsf)
        .then(dependencies => {
            return config.packageSubfoldersIntellisense ?
                readModuleSubFolders(dependencies, state, fsf) : dependencies;
        })
        .then(dependencies => dependencies.map(d => toCompletionItem(d, state)));
}

export function getNpmPackages(state: State, config: Config, fsf: FsFunctions) {
    return fsf.readJson(getPackageJson(state, config, fsf))
        .then(packageJson => [
            ...Object.keys(packageJson.dependencies || {}),
            ...Object.keys(config.scanDevDependencies ? packageJson.devDependencies || {} : {}),
            ...(config.showBuildInLibs ? getBuildInModules() : [])
        ])
        .catch(() => []);
}

function getBuildInModules() : string[] {
    return (<any>repl)._builtinLibs;
}

function toCompletionItem(dependency: string, state: State) {
    return new PackageCompletionItem(dependency, state);
}

function getPackageJson(state: State, config: Config, fsf: FsFunctions) {
    return config.recursivePackageJsonLookup ?
        nearestPackageJson(state.rootPath, state.filePath, fsf) :
        join(state.rootPath, 'package.json');
}

function nearestPackageJson(rootPath: string, currentPath: string, fsf: FsFunctions): string {
    const packageJsonFullPath = join(currentPath, 'package.json');

    if (currentPath === rootPath || fsf.isFile(packageJsonFullPath)) {
        return packageJsonFullPath;
    }

    return nearestPackageJson(rootPath, resolve(currentPath, '..'), fsf);
}

function readModuleSubFolders(dependencies: string[], state: State, fsf: FsFunctions) {
    const fragments: Array<string> = state.textCurrentLine.split('from ');
    const pkgFragment: string = fragments[fragments.length - 1].split(/['"]/)[1];
    const pkgFragmentSplit = pkgFragment.split('/');
    const packageName: string = pkgFragmentSplit[0];

    if (dependencies.filter(dep => dep === packageName).length) {
        const path = join(state.rootPath, 'node_modules', ...pkgFragmentSplit);
        // Todo: make the replace function work with other filetypes as well
        return fsf.readDir(path)
            .then(files => files.map(file => pkgFragment + file.replace(/\.js$/, '')))
            .catch(err => ['']);
    }

    return Promise.resolve(dependencies);
}