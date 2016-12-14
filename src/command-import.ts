import { workspace, window, TextEditorEdit, QuickPickOptions, QuickPickItem } from 'vscode';
import { dirname } from 'path';
import { getNpmPackages } from './provide';
import { fsf } from './fs-functions';
import { State } from './State';
import { getConfig, Config } from './config';
import { getImportStatementFromFilepath, getQuickPickItems } from './util';

const quickPickOptions : QuickPickOptions = {
    matchOnDescription: true
}

export function onImportCommand() {
    const config = getConfig();
    window.showQuickPick(getPackages(config), quickPickOptions)
        .then(selection => addImportStatementToCurrentFile(selection, config));
}

function getPackages(config: Config): QuickPickItem[] {
    const state : State = {
        filePath: dirname(window.activeTextEditor.document.fileName),
        rootPath: workspace.rootPath,
        cursorLine: undefined,
        cursorPosition: undefined,
        textCurrentLine: undefined
    };

    return getNpmPackages(state, config, fsf)
    			.then(npmPackages => npmPackages.map(moduleNameToQuickPickItem))
    			.catch(error => window.showErrorMessage(error) );
}

function moduleNameToQuickPickItem(moduleName: string) : QuickPickItem {
    return {
        label: moduleName,
        description: 'npm module'
    };
}

function addImportStatementToCurrentFile(item: QuickPickItem, config: Config) {
    const statementES6 = `import {} from ${config.importQuotes}${item.label}${config.importQuotes}${config.importLinebreak}`;
    const statementRequire = `${config.importDeclarationType} xy = require(${config.importQuotes}${item.label}${config.importQuotes})${config.importLinebreak}`;
    const statement = config.importES6 ? statementES6 : statementRequire;
    const insertLocation = window.activeTextEditor.selection.start;
    window.activeTextEditor.edit(edit => edit.insert(insertLocation, statement));
}

