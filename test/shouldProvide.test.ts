import * as assert from 'assert';
import { shouldProvide } from '../src/shouldProvide';
import { State } from '../src/State';

suite("shouldProvide Tests", () => {
    test("Should provide when is import", () => {
        const state = createState("import {  } from '‸'");
        assert.equal(true, shouldProvide(state));
    });

    test("Should provide when is require", () => {
        const state = createState("var xy = require('‸')");
        assert.equal(true, shouldProvide(state));
    });

    test("Should not provide when not import or require", () => {
        const state = createState("anything '‸'");
        assert.equal(false, shouldProvide(state));
    });

    test("Should not provide when import starts with a dot", () => {
        const state = createState("import {  } from '.‸'");
        assert.equal(false, shouldProvide(state));
    });

    test("Should not provide when import starts with a dot", () => {
        const state = createState("import '.‸'");
        assert.equal(false, shouldProvide(state));
    });

    test("Should provide when import is followed by a module name without a dot", () => {
        const state = createState("import '‸'");
        assert.equal(true, shouldProvide(state));
    });

    test("Should provide when import is followed by a module name and bad spacing", () => {
        const state = createState("import'‸'");
        assert.equal(true, shouldProvide(state));
    });

});

function createState(line: string) : State {
    return {
        rootPath: undefined,
        filePath: undefined,
        textCurrentLine: line.split('‸').join(),
        cursorPosition: line.indexOf('‸'),
        cursorLine: 0
    }
}