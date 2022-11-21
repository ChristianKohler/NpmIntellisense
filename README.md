# Npm Intellisense

Visual Studio Code plugin that autocompletes npm modules in import statements.

![auto complete](/images/auto_complete.gif)

## Sponsors

<p><a title="Try CodeStream" href="https://sponsorlink.codestream.com/?utm_source=vscmarket&amp;utm_campaign=npmintel&amp;utm_medium=banner"><img src="https://alt-images.codestream.com/codestream_logo_npmintel.png"></a></br>
Eliminate context switching and costly distractions. Create and merge PRs and perform code reviews from inside your IDE while using jump-to-definition, your favorite keybindings, and other IDE tools.<br> <a title="Try CodeStream" href="https://sponsorlink.codestream.com/?utm_source=vscmarket&amp;utm_campaign=npmintel&amp;utm_medium=banner">Learn more</a></p>

<p>
<a title="Try stepsize" href="https://bit.ly/36hVwgW"><img src="./docs/images/sponsors/stepsize.png"></a></br>
Track and prioritise tech debt and maintenance issues, straight from your IDE. Bookmark code while you work, organise TODOs and share codebase knowledge with your team. <a title="Try stepsize" href="https://bit.ly/36hVwgW">Try it out for free today.</a>
</p>

<p>
<a title="Try documatic" href="https://app.documatic.com/integration/vscode?utm_source=npm+Intellisense&utm_medium=banner&utm_id=VSCode"><img src="./docs/images/sponsors/documatic.png"></a></br>
Navigate through large codebases and onboard engineers quicker than before using Documatic. A search engine for your codebase; Ask documatic a question in your IDE and find relevant code snippets and insights in seconds. <a title="Try stepsize" href="https://app.documatic.com/integration/vscode?utm_source=npm+Intellisense&utm_medium=banner&utm_id=VSCode">Use it for free here.</a>
</p>

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

## License

This software is released under [MIT License](http://www.opensource.org/licenses/mit-license.php)
