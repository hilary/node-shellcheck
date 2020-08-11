# ShellCheck

Node wrapper of ShellCheck, a GPLv3 tool that gives warnings and suggestions for bash/sh shell scripts.

This package downloads [koalaman's shellcheck](https://www.shellcheck.net/) from the official servers and makes the binary available at `node_modules/.bin/shellcheck`. There is also a NodeJS module available so you can execute directly from JavaScript.

```javascript
const shellcheck = require("node-shellcheck");
shellcheck("tests/example.bash");
```

## Installation

```sh
npm install --dev shellcheck
```

## Usage

Edit `package.json` to call `shellcheck` from your npm scripts:

```json
{
  "scripts": {
    "lint": "shellcheck '**/*.sh'"
  }
}
```

## Related

- [hadolint](https://github.com/hadolint/hadolint): Lint Dockerfiles and the inline bash code in them

## License

- [http://gunar.mit-license.org](MIT)
