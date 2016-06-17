import { CompletionItemProvider, TextDocument, Position, CompletionItem, CompletionItemKind, workspace } from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

import { LANGUAGES } from './languages';
import * as fsRider from './fs-rider';

const INDEX = '/index';

const EXTENSIONS = {};
Object.keys(LANGUAGES).forEach(it => EXTENSIONS[LANGUAGES[it]] = true);

function matcher(file: string) {
    const ext = file.substring(file.lastIndexOf('.'));
    return EXTENSIONS[ext];
}

/**
 * Searches for packages/files underneath fileName's parent folder, that start with the given prefix.
 * @return undefined if prefix does not start with a dot (.)
 */
export function localPackages(root: string, fileName: string, prefix: string, exclude: string[]): Promise<CompletionItem[]> {

    const none = Promise.resolve([]);

    const dirname = path.dirname(fileName);
    const cwdCandidate = path.join(dirname, prefix);

    const parentUsed = !fs.existsSync(cwdCandidate);
    const cwd = parentUsed ? path.dirname(cwdCandidate) : cwdCandidate;

    try {
        if (fs.realpathSync(cwd).length < fs.realpathSync(root).length) {
            return none;
        }
    } catch (err) {
        return none;
    }

    const matchPrefix = prefix.endsWith('/') ? '' : '/';

    function toLabel(match: string): string {
        match = match.substring(0, match.lastIndexOf('.'));
        if (match.endsWith(INDEX)) {
            match = match.substring(0, match.length - INDEX.length);
        }
        return matchPrefix + match;
    }

    function notSelf(match: string): boolean {
        return path.join(dirname, match) !== fileName;
    }

    const existingLabels = {};
    function dups(label: string): boolean {
        if (existingLabels[label]) {
            return false;
        }
        return existingLabels[label] = true;
    }

    return new Promise((resolve, reject) => {
        try {
            const matches = fsRider.rideDirectoryTree(cwd, exclude, matcher);

            function toCompletionItem(label: string): CompletionItem {
                const it = new CompletionItem(label);
                it.insertText = parentUsed ? label.substring(1) : label;
                it.kind = CompletionItemKind.Module;
                return it;
            }

            resolve(matches
                .filter(notSelf)
                .map(toLabel)
                .filter(dups)
                .map(toCompletionItem));

        } catch (err) {
            reject(err);
        }
    });
}