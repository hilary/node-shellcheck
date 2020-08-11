const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

/**
 * Execute shellcheck installed in 'bin' folder.
 */
function main() {
    let filename;

    if (process.platform === 'win32') {
        filename = `shellcheck-latest.exe`;
    } else {
        filename = `shellcheck-latest`;
    }

    const shellcheck = path.normalize(`${__dirname}/../bin/${filename}`);

    shell.exec(`"${shellcheck}" ${process.argv.slice(2).join(' ')}`);
}

main();
