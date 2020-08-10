# shellcheck

Linting for your bash code.

This package downloads [koalaman's shellcheck](https://www.shellcheck.net/) from the official servers.
And makes the binary available at `node_modules/.bin/shellcheck`.

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

[http://gunar.mit-license.org](MIT)
