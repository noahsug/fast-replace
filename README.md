# fast-replace
> fast-replace recursively finds and replaces regex at blazing fast speeds

 * ~12x faster than other replacers (uses [ripgrep](https://github.com/BurntSushi/ripgrep) under the hood)
 * recursive by default
 * respects `.gitignore` by default
 * matches file globs
 * supports regex capture groups

## Installation
```sh
npm install -g fast-replace
```

## Examples
Replace all occurrences of `foo` with `bar` recursively starting from the current directory:
```
fast-replace 'foo' 'bar'
```

Preview replacements without modifying any files:
```
fast-replace 'foo' 'bar' -D
```

Replace only in `mock.js` and the `tests/` directory:
```
fast-replace 'foo' 'bar' mock.js tests/
```

Replace snake_case_words with kebob-case-words:
```
fast-replace '(\S)_(\S)' '$1-$2'
```

Replace only in files with names matching `*.js` or `*.jsx`:
```
fast-replace 'foo' 'bar' -g '*.js' '*.jsx'
```

Replace only in files *not* in the `vendors/` directory:
```
fast-replace 'foo' 'bar' -G 'vendors/**'
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

fastReplace('from', 'to', { /* options, matches CLI */ }).then(changedFiles => {});
```
