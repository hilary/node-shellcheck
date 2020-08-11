const path = require('path');
const shell = require('shelljs');

/**
 * Execute shellcheck installed in 'bin' folder.
 *
 * @param {Array} args Arguments to pass to shellcheck.
 */
function main(args = process.argv.slice(2)) {
    let filename;

    if (process.platform === 'win32') {
        filename = `shellcheck-latest.exe`;
    } else {
        filename = `shellcheck`;
    }

    const shellcheck = path.normalize(`${__dirname}/../bin/${filename}`);

    outargs = args;
    if (Array.isArray(args)) {
        outargs = args.join(' ');
    }
    result = shell.exec(`"${shellcheck}" ${outargs}`);

    return result.code;
}

module.exports = main;