# Npm Intellisense
Visual Studio Code plugin that autocompletes npm modules in import statements.

![auto complete](/images/auto_complete.gif)

## Installation
In the command palette (cmd-shift-p) select Install Extension and choose npm Intellisense.

![install](/images/npm_install.gif)

## Contributing
Something missing? Found a bug? - Create a pull request or an issue.
[Github](https://github.com/ChristianKohler/NpmIntellisense)

## Settings
### Scan devDependencies
Npm intellisense scans only dependencies by default. Set scanDevDependencies to true to enable it for devDependencies too.

```javascript
{
	"npm-intellisense.scanDevDependencies": true,
}
```

## History
* v0.1.0 - Initial release 

## License
This software is released under [MIT License](http://www.opensource.org/licenses/mit-license.php)
