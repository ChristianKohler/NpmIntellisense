'use strict';
import { ExtensionContext, languages, workspace, commands, window, TextEditorEdit } from 'vscode';
import { NpmIntellisense } from './NpmIntellisense';
import { getQuickPickItems, getImportStatementFromFilepath } from './util';

export function activate(context: ExtensionContext) {
	if (workspace.rootPath) {
		const provider = new NpmIntellisense();
		const triggers = ['"', '\'', '/'];
	  const selector = ['typescript', 'javascript', 'javascriptreact', 'typescriptreact'];
		context.subscriptions.push(languages.registerCompletionItemProvider(selector, provider, ...triggers));

		var disposable = commands.registerCommand('npm-intellisense.import', () => {

			window.showQuickPick(
				provider.getNpmPackages()
					.then(getQuickPickItems)
					.catch(error => {
						window.showErrorMessage(error);
					}),
					{
						matchOnDescription: true
					}
			)
				.then( ( item:any ) => {

					let statement:string = getImportStatementFromFilepath(item.filePath);

					window.activeTextEditor.edit(
						( edit:TextEditorEdit ) => {
							edit.insert(
								window.activeTextEditor.selection.start,
								statement
							)
						}
					)
				});
		});
	}
	
	context.subscriptions.push(disposable);
}

export function deactivate() {
}
