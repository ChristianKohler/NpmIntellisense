import { join, resolve } from 'path';
import * as repl from 'repl';
import { CompletionItem } from 'vscode';
import { Config } from './config';
import { FsFunctions } from './fs-functions';
import { PackageCompletionItem } from './PackageCompletionItem';
import { State } from './State';

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
    const absoluteCurrentPath = resolve(currentPath);
    const absoluteRootPath =  resolve(rootPath);
    const packageJsonFullPath = join(absoluteCurrentPath, 'package.json');
    

    console.log("absoluteCurrentPath " + absoluteCurrentPath);
    console.log("absoluteRootPath " + absoluteRootPath);
    console.log("packageJsonFullPath " + packageJsonFullPath);
    

    if (absoluteCurrentPath === absoluteRootPath || fsf.isFile(packageJsonFullPath)) {
        return packageJsonFullPath;
    }

    return nearestPackageJson(absoluteRootPath, resolve(absoluteCurrentPath, '..'), fsf);
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