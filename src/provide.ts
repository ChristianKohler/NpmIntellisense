import { State } from './State';
import { Config } from './config';
import { fsf, FsFunctions } from './fs-functions';
import { join, resolve } from 'path';
import { CompletionItem } from 'vscode';

export function provide(state: State, config: Config, fsf: FsFunctions): Promise<CompletionItem[]> {
    return getNpmPackages(state, config, fsf)
        .then(dependencies => dependencies.map(toCompletionItem));
}

function toCompletionItem(dependency) {
    return new CompletionItem(dependency);
}

function getNpmPackages(state: State, config: Config, fsf: FsFunctions) {
    return fsf.readJson(getPackageJson(state, config, fsf))
        .then(packageJson => [
            ...Object.keys(packageJson.dependencies || {}),
            ...Object.keys(config.scanDevDependencies ? packageJson.devDependencies || {} : {})
        ])
        .catch(() => []);
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