# Npm Intellisense
Visual Studio Code plugin that autocompletes npm modules in import statements.

![auto complete](/images/auto_complete.gif)

## Installation
In the command palette (cmd-shift-p) select Install Extension and choose npm Intellisense.

![install](/images/npm_install.gif)

Note: Visual Studio Code v1.17 (September 2017) [now includes](https://code.visualstudio.com/updates/v1_17#_import-path-quick-suggestions-in-javascript-and-typescript) part of this functionality. If you enable this plugin and the built-in feature, you will see double results in the suggestions.

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

### Show built-in (local) libs
Shows built-in node modules like 'path' of 'fs'

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


## License
This software is released under [MIT License](http://www.opensource.org/licenses/mit-license.php)
