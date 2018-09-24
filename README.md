# fast-replace

fast-replace installs [ripgrep](https://github.com/BurntSushi/ripgrep) to recursively find and replace regex at blazing fast speeds

## Installation
```sh
npm install -g fast-replace
```

## Examples
Replace all occurrences of `foo` with `bar` recursively starting from the current directory:
```
fast-replace 'foo' 'bar'
```

Preview replacements without making any changes:
```
fast-replace 'foo' 'bar' -D
```

Replace occurrences in `mock.js` and files in the `tests/` directory:
```
fast-replace 'foo' 'bar' mock.js tests/
```

Change snake_case to kebab-case:
```
fast-replace '(\S)_(\S)' '$1-$2'
```

Only include `.js` and `.jsx` files not found in `vendor/`:
```
replace 'foo' 'bar' -g '*.js' '*.jsx' -G 'vendor/**'
```

## Options

```
fast-replace <from> <to> [paths...]

  <from>              Regex pattern to match
  <to>                String to replace matched pattern, use $1 to match regex
                      groups
  [paths...]          Directories or files to recursively search

Options:
  --dryrun, -D        Print replacements without making changes
  --quiet, -q         Shhh, don't print anything
  --unrestricted, -u  Don't respect .gitignore
  --ignoreCase, -i    Search with case insensitively
  --fixedStrings, -F  Treat pattern as a literal string instead of a regular
                      expression
  --globs, -g         Include files / directories matching the given globs
  --ignoreGlobs, -G   Exclude files / directories matching the given globs
  --version           Show version number
  --help              Show help
```

## API
```js
const fastReplace = require('fast-replace');

fastReplace('from', 'to', {
  quiet: true,
  paths: ['dir', 'file'],
  unrestricted: true,
  ignoreCase: true,
  fixedStrings: true,
  globs: ['*.js', '*.jsx'],
  ignoreGlobs: ['vendor/**'],
}).then(...)
```