import { normalize } from "path";
import { exec } from "shelljs";

/**
 * Execute shellcheck installed in 'bin' folder.
 *
 * @param {Array} args Arguments to pass to shellcheck.
 * @return {num} Error code from running shellcheck.
 */
function shellcheck(args = process.argv.slice(2)) {
    let filename;

    if (process.platform === 'win32') {
        filename = `shellcheck-latest.exe`;
    } else {
        filename = `shellcheck`;
    }

    const shellcheck = normalize(`${__dirname}/../bin/${filename}`);

    var outargs:string;

    if (Array.isArray(args)) {
        outargs = args.join(' ');
    } else {
        outargs = args
    }

    var result = exec(`"${shellcheck}" ${outargs}`);

    return result.code;
}

export { shellcheck };
