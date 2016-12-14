'use strict';
import { ExtensionContext, languages, workspace, commands } from 'vscode';
import { NpmIntellisense } from './NpmIntellisense';
import { onImportCommand } from './command-import';

export function activate(context: ExtensionContext) {
	if (workspace.rootPath) {
		const provider = new NpmIntellisense();
		const triggers = ['"', '\'', '/'];
		const selector = ['typescript', 'javascript', 'javascriptreact', 'typescriptreact'];
		context.subscriptions.push(languages.registerCompletionItemProvider(selector, provider, ...triggers));
		context.subscriptions.push(commands.registerCommand('npm-intellisense.import', onImportCommand));
	}
}

export function deactivate() {
}
