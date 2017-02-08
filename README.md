# Npm Intellisense
Visual Studio Code plugin that autocompletes npm modules in import statements.

![auto complete](/images/auto_complete.gif)

## Installation
In the command palette (cmd-shift-p) select Install Extension and choose npm Intellisense.

![install](/images/npm_install.gif)


## Contributing
Something missing? Found a bug? - Create a pull request or an issue.
[Github](https://github.com/ChristianKohler/NpmIntellisense)

## Features
### Import command

![import command](/images/importcommand.gif)

```javascript
{
	"npm-intellisense.importES6": true,
	"npm-intellisense.importQuotes": "'",
	"npm-intellisense.importLinebreak": ";\r\n",
	"npm-intellisense.importDeclarationType": "const",
}
```

### Import command (ES5)

![import command](/images/require_withname.gif)

```javascript
{
	"npm-intellisense.importES6": false,
	"npm-intellisense.importQuotes": "'",
	"npm-intellisense.importLinebreak": ";\r\n",
	"npm-intellisense.importDeclarationType": "const",
}
```

### Scan devDependencies
Npm intellisense scans only dependencies by default. Set scanDevDependencies to true to enable it for devDependencies too.

```javascript
{
	"npm-intellisense.scanDevDependencies": true,
}
```

### Show build in (local) libs
Shows build in node modules like 'path' of 'fs'

```javascript
{
	"npm-intellisense.showBuildInLibs": true,
}
```

### Lookup package.json recursive
Look for package.json inside nearest directory instead of workspace root. It's enabled by default.

```javascript
{
	"npm-intellisense.recursivePackageJsonLookup": true,
}
```

### Experimental: Package Subfolder Intellisense
Open subfolders of a module.
This feature is work in progress and experimental.

```javascript
{
	"npm-intellisense.packageSubfoldersIntellisense": false,
}
```

## History
### v1.2.1
- Documentation: Added missing documentation for showBuildInLibs

### v1.2.0
- Feature: Support for ```import 'modulename'``` syntax. Thank you @elderfo #25

### v1.1.0
- Feature: Import command, thank you @dgieselaar
- Feature: List build in node modules #14

### v1.0.0
- Feature: recursivePackageJsonLookup, thank you @kasperekt
- Feature: packageSubfoldersIntellisense  (experimental), thank you @dgieselaar
- Fixes dashes inside name, thank you @kasperekt, #10

### v0.1.4
- Fixed #13, #16

### v0.1.3
- Fixed conflict with PathIntellisense

### v0.1.1
- Fixed compatibility with VS Code 1.3

### v0.1.0
- Initial release 

## License
This software is released under [MIT License](http://www.opensource.org/licenses/mit-license.php)
