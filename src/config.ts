import { workspace } from 'vscode'

export interface Config {
    scanDevDependencies?: boolean,
    recursivePackageJsonLookup?: boolean,
    packageSubfoldersIntellisense?: boolean,
    showBuiltInLibs?: boolean,
    importES6?: boolean,
    importQuotes?: string,
    importLinebreak?: string,
    importDeclarationType?: string
}

export function getConfig(): Config {
    const configuration = workspace.getConfiguration('npm-intellisense');

    return {
        scanDevDependencies: configuration['scanDevDependencies'],
        recursivePackageJsonLookup: configuration['recursivePackageJsonLookup'],
        packageSubfoldersIntellisense: configuration['packageSubfoldersIntellisense'],
        showBuiltInLibs: configuration['showBuiltInLibs'],
        importES6: configuration['importES6'],
        importQuotes: configuration['importQuotes'],
        importLinebreak: configuration['importLinebreak'],
        importDeclarationType: configuration['importDeclarationType']
    };
}