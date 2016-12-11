'use_strict';
import { workspace, window } from 'vscode';
import { readdir, stat } from 'fs';
import { join, sep, relative, extname } from 'path';

export const isDirectory = ( path ):Promise<boolean> => {
	return new Promise(( resolve, reject ) => {
		stat(path, ( error, stats ) => {
			if (error) {
				reject(error);
			} else {
				resolve(stats.isDirectory());
			}
		});
	});
};

export const readFilesFromDir = ( dir:string ):Promise<Array<string>> => {

	return new Promise<Array<string>>(( resolve, reject ) => {
		let paths:Array<string> = [];
		readdir(dir, ( error, files ) => {

			Promise.all(
				files.map(file => {
					const path = join(dir, file);

					if (file === 'node_modules') {
						return Promise.resolve([]);
					}

					return isDirectory(path)
						.then(isDir => isDir ? readFilesFromDir(path) : Promise.resolve( [ path ]));

				})
			)
				.then(( filesPerDir:Array<any> ) => {
					resolve([].concat(...filesPerDir))
				})
				.catch(error => reject(error));
			
		});
	});

}

export const readFilesFromPackage = ( packageName:string ):Promise<Array<string>> => {
	return readFilesFromDir(
		join(workspace.rootPath, 'node_modules', packageName)
	);
}

export const getQuickPickItems = ( packages:Array<string> ):Promise<any> => {

	const root = workspace.rootPath;
	const nodeRegEx = new RegExp(`^node_modules\\${sep}`);

	return Promise.all(
		[ readFilesFromDir(root) ].concat(packages.map(readFilesFromPackage))
	)
		.then(( filesPerPackage:Array<any> ) => {
			let items:Array<any> =
				[].concat(...filesPerPackage)
					.map( ( filePath:string ) => {
						const partialPath:string = filePath.replace(root + sep, '').replace(nodeRegEx, '');
						const fragments:Array<string> = partialPath.split(sep);
						const label:string = fragments[fragments.length-1];
						const description:string = fragments.join('/');

						return { label, description, filePath };
					});

			return items;
		})
};

export const getImportStatementFromFilepath = ( filePath:string ):string => {
	let partialPath:string = !filePath.includes('node_modules') ?
			relative(window.activeTextEditor.document.fileName, filePath)
			: filePath.replace(join(workspace.rootPath, 'node_modules') + sep, '');

		let fragments:Array<string> =
			filePath.split(sep)
				.map( ( fragment:string, index:number, arr:Array<any> ) => {
					return index === arr.length - 1 ?
						fragment.replace(/\.js$/, '')
							.replace(/^index$/, '')
						: fragment;
				})
				.filter(fragment => !!fragment);

		let moduleName:string = fragments[fragments.length - 1]
			.replace(/[\-](.)/g, ( substring:string, ...rest:Array<any> ) => rest[0].toUpperCase());

		moduleName = moduleName.replace(new RegExp(`${extname(moduleName)}$`), '')
			.replace(/^[^a-z$]/i, '');

		let packagePath:string = partialPath.split(sep).filter(fragment => fragment !== 'index.js').join('/') || '.';

		let importES6:boolean = workspace.getConfiguration('npm-intellisense')['importES6'];
		let quoteType:string = workspace.getConfiguration('npm-intellisense')['importQuotes'];
		let linebreak:string = workspace.getConfiguration('npm-intellisense')['importLinebreak'];
		let declaration:string = workspace.getConfiguration('npm-intellisense')['importDeclarationType'];
		let statement:string;

		if (importES6) {
			statement = `import ${moduleName} from ${quoteType}${packagePath}${quoteType}` 
		} else {
			statement = `${declaration} ${moduleName} = require(${quoteType}${packagePath}${quoteType})`
		}

		statement += `${linebreak}`;

		return statement;
};