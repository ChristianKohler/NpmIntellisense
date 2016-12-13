import { workspace } from 'vscode'

export interface Config {
    scanDevDependencies: boolean,
    recursivePackageJsonLookup: boolean,
    packageSubfoldersIntellisense: boolean
}

export function getConfig() : Config {
    const configuration = workspace.getConfiguration('npm-intellisense');

    return {
        scanDevDependencies: configuration['scanDevDependencies'],
        recursivePackageJsonLookup: configuration['recursivePackageJsonLookup'],
        packageSubfoldersIntellisense: configuration['packageSubfoldersIntellisense'],
    };
}