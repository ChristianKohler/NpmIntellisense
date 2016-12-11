import { readFile, readdir, statSync } from 'fs';

export interface FsFunctions {
    readJson: Function,
    isFile: Function
}

export const fsf : FsFunctions = {
    readJson,
    isFile
}

function readJson(file) {
    return new Promise<any>((resolve, reject) => {
        readFile(file, (err, data) => err ? reject(err) : resolve(JSON.parse(data.toString())));
    });
}

function isFile(path: string) {
    try {
        return statSync(path).isFile();
    } catch (err) {
        return false;
    }
}