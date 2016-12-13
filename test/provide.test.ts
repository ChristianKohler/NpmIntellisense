import * as assert from 'assert';
import { provide } from '../src/provide';
import { State } from '../src/State';
import { Config } from '../src/config';
import { FsFunctions } from '../src/fs-functions';

suite("provide Tests", () => {
    test("Should read dependencies", (done: MochaDone) => {
        const state = createState();
        const config : Config = {
            recursivePackageJsonLookup: false,
            scanDevDependencies: false,
            packageSubfoldersIntellisense: false
        };
        const fsf = createFsf();

        provide(state, config, fsf)
            .then(dependencies => {
                assert.equal(2, dependencies.length);
                assert.equal('donald', dependencies[0].textEdit.newText);
                assert.equal('daisy', dependencies[1].textEdit.newText);
            })
            .then(() => done())
            .catch(err => done(err));
    });

    test("Should read dev dependencies", (done: MochaDone) => {
        const state = createState();
        const config: Config = {
            recursivePackageJsonLookup: false,
            scanDevDependencies: true,
            packageSubfoldersIntellisense: false
        };
        const fsf = createFsf();

        provide(state, config, fsf)
            .then(dependencies => {
                assert.equal(3, dependencies.length);
                assert.equal('donald', dependencies[0].textEdit.newText);
                assert.equal('daisy', dependencies[1].textEdit.newText);
                assert.equal('daniel', dependencies[2].textEdit.newText);
            })
            .then(() => done())
            .catch(err => done(err));
    });

    test("Should get nearest package json", (done: MochaDone) => {
        const state = createState();
        const config: Config = {
            recursivePackageJsonLookup: true,
            scanDevDependencies: false,
            packageSubfoldersIntellisense: false
        };
        const fsf = createFsf();

        provide(state, config, fsf)
            .then(dependencies => {
                assert.equal(1, dependencies.length);
                assert.equal('goofy', dependencies[0].textEdit.newText);
            })
            .then(() => done())
            .catch(err => done(err));
    });
});

function createState(): State {
    return {
        rootPath: '/User/dummy/project',
        filePath: '/User/dummy/project/src',
        textCurrentLine: "import {} from ''",
        cursorPosition: 16,
        cursorLine: 0
    }
}

function createFsf(): FsFunctions {
    return {
        readJson: readJsonMock,
        isFile: isFileMock,
        readDir: readDirMock
    };
}

function readJsonMock(path) : Promise<any> {
    switch (path) {
        case '/User/dummy/project/src/package.json':
            return Promise.resolve({
                dependencies: {
                    "goofy": "1.0.0"
                }
            });
        default:
            return Promise.resolve({
                dependencies: {
                    "donald": "1.0.0",
                    "daisy": "1.0.0"
                },
                devDependencies: {
                    "daniel": "1.0.0",
                }
            });
    }
}

function isFileMock(path) {
    return [
        '/User/dummy/project/src/package.json',
        '/User/dummy/project/package.json'
    ].indexOf(path) !== -1;
}

function readDirMock(path) {
    return [];
}