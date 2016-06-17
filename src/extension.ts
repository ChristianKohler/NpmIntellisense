'use strict';
import { ExtensionContext, languages, DocumentSelector } from 'vscode';
import { NpmIntellisense } from './NpmIntellisense';
import { LANGUAGES } from './languages';

export function activate(context: ExtensionContext) {
	const provider = new NpmIntellisense();
	const triggers = ['"', '\'', '.'];
    const selector = Object.keys(LANGUAGES);
	context.subscriptions.push(languages.registerCompletionItemProvider(selector, provider, ...triggers));
}

export function deactivate() {
}