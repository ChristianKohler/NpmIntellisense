import * as path from 'path';
import * as fs from 'fs';

interface FileFun {
    (file: string, fullPath: string): void;
}

function accept(cwd: string, exclude: FileFun, visit: FileFun) {
    fs.readdirSync(cwd).forEach(file => {
        const full = path.join(cwd, file);
        if (exclude(file, full)) {
            return;
        }
        if (fs.lstatSync(full).isDirectory()) {
            accept(full, exclude, visit);
        } else {
            visit(file, full);
        }
    });
}

export function rideDirectoryTree(cwd: string, excludes: string[] = [], matcher: (file: string) => boolean): string[] {

    const result: string[] = [];

    function visit(file: string, full: string) {
        if (matcher(full)) {
            result.push(path.relative(cwd, full).replace(/\\/g, '/'));
        }
    }

    function exclude(file: string, path: string): boolean {
        return excludes.indexOf(file) >= 0 || file[0] === '.';
    }

    accept(cwd, exclude, visit);

    return result;
}
