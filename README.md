# fast-replace
> fast-replace installs [ripgrep](https://github.com/BurntSushi/ripgrep) to recursively find and replace regex at blazing fast speeds

 * ~12x faster than other regex replacers (like [replace](https://www.npmjs.com/package/replace))
 * recursive by default
 * respects `.gitignore` by default
 * matches file globs
 * supports regex capture groups

## Installation
```sh
npm install -g fast-replace
```

I recommend aliasing `fast-replace` to `fr` by adding the following to your shell profile:
```
alias fr="fast-replace"
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
  <to>                String to replace matched pattern, use $1, $2, etc to
                      match regex groups
  [paths...]          Directories or files to recursively search

Options:
  --dryrun, -D            print replacements without making changes    [boolean]
  --quiet, -q             shhh                                         [boolean]
  --unrestricted, -u      don't respect .gitignore                     [boolean]
  --ignoreCase, -i        search with case insensitively               [boolean]
  --fixedStrings, -F      treat pattern as a literal string instead of a regular
                          expression                                   [boolean]
  --globs, -g             include files / directories matching the given glob
                                                                         [array]
  --ignoreGlobs, -G       exclude files / directories matching the given glob
                                                                         [array]
  --ignoreLargeFiles, -L  Ignore files larger than 50KB in size        [boolean]
  --help                  Show help                                    [boolean]
  --version               Show version number                          [boolean]
```

## API
```js
const fastReplace = require('fast-replace');

fastReplace('from', 'to', options).then(...); // options match CLI options
```
