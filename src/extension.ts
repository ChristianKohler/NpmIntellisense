'use strict';
import { ExtensionContext, languages, DocumentSelector, workspace } from 'vscode';
import { NpmIntellisense } from './NpmIntellisense';

export function activate(context: ExtensionContext) {
	if (workspace.rootPath) {
		const provider = new NpmIntellisense();
		const triggers = ['"', '\'', '/'];
	    const selector = ['typescript', 'javascript', 'javascriptreact', 'typescriptreact'];
		context.subscriptions.push(languages.registerCompletionItemProvider(selector, provider, ...triggers));
	}
}

export function deactivate() {
}
