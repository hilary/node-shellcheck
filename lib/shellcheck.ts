/**
 * Wrapper function to call ShellCheck directly from JavaScript/TypeScript to
 * handle intrinsic knowledge we have about where ShellCheck binaries were either
 * installed or extracted.
 */
import {normalize} from 'path';
import {spawnSync, SpawnSyncReturns} from 'child_process';

/**
 * Get executable path.
 *
 * @return {string} Absolute path of ShellCheck executable.
 */
function getExecutable(): string {
    let filename;

    if (process.platform === 'win32') {
        filename = `shellcheck-latest.exe`;
    } else {
        filename = `shellcheck`;
    }

    return normalize(`${__dirname}/../bin/${filename}`);
}

/**
 * Execute shellcheck installed in 'bin' folder.
 *
 * @param {Array} args Arguments to pass to shellcheck.
 * @return {SpawnSyncReturns<string>} Error code from running shellcheck.
 */
function shellcheck(args = process.argv.slice(2)): SpawnSyncReturns<string> {
    return spawnSync(getExecutable(), args);
}

export {shellcheck, getExecutable};
