import * as assert from "assert";
import { provide } from "../../src/provide";
import { State } from "../../src/State";
import { Config } from "../../src/config";
import { FsFunctions } from "../../src/fs-functions";

suite("provide Tests", () => {
  test("Should read dependencies", (done) => {
    const state = createState();
    const config: Config = {};
    const fsf = createFsf();

    provide(state, config, fsf)
      .then((dependencies) => {
        assert.equal(2, dependencies.length);
        assert.equal("donald", dependencies[0].textEdit.newText);
        assert.equal("daisy", dependencies[1].textEdit.newText);
      })
      .then(() => done())
      .catch((err) => done(err));
  });

  test("Should read dev dependencies", (done) => {
    const state = createState();
    const config: Config = {
      scanDevDependencies: true,
    };
    const fsf = createFsf();

    provide(state, config, fsf)
      .then((dependencies) => {
        assert.equal(3, dependencies.length);
        assert.equal("donald", dependencies[0].textEdit.newText);
        assert.equal("daisy", dependencies[1].textEdit.newText);
        assert.equal("daniel", dependencies[2].textEdit.newText);
      })
      .then(() => done())
      .catch((err) => done(err));
  });

  test("Should show build in node modules when enabled", (done) => {
    const state = createState();
    const config: Config = {
      showBuildInLibs: true,
    };
    const fsf = createFsf();

    provide(state, config, fsf)
      .then((dependencies) => {
        assert.equal(dependencies.length,  43);
        assert.equal(
          true,
          dependencies.some((d) => d.textEdit.newText === "fs")
        );
        assert.equal(
          true,
          dependencies.some((d) => d.textEdit.newText === "path")
        );
      })
      .then(() => done())
      .catch((err) => done(err));
  });

  test("Should get nearest package json", (done) => {
    const state = createState();
    const config: Config = {
      recursivePackageJsonLookup: true,
    };
    const fsf = createFsf();

    provide(state, config, fsf)
      .then((dependencies) => {
        assert.equal(1, dependencies.length);
        assert.equal("goofy", dependencies[0].textEdit.newText);
      })
      .then(() => done())
      .catch((err) => done(err));
  });
});

function createState(): State {
  return {
    rootPath: "/User/dummy/project",
    filePath: "/User/dummy/project/src",
    textCurrentLine: "import {} from ''",
    cursorPosition: 16,
    cursorLine: 0,
  };
}

function createFsf(): FsFunctions {
  return {
    readJson: readJsonMock,
    isFile: isFileMock,
    readDir: readDirMock,
  };
}

function readJsonMock(path): Promise<any> {
  switch (path) {
    case "C:\\User\\dummy\\project\\src\\package.json":
    case "/User/dummy/project/src/package.json":
      return Promise.resolve({
        dependencies: {
          goofy: "1.0.0",
        },
      });
    default:
      return Promise.resolve({
        dependencies: {
          donald: "1.0.0",
          daisy: "1.0.0",
        },
        devDependencies: {
          daniel: "1.0.0",
        },
      });
  }
}

function isFileMock(path) {
  return (
    [
      "/User/dummy/project/src/package.json",
      "/User/dummy/project/package.json",
      "C:\\User\\dummy\\project\\src\\package.json",
      "C:\\User\\dummy\\project\\package.json",
    ].indexOf(path) !== -1
  );
}

function readDirMock(path) {
  return [];
}
