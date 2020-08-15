/**
 * Load shellcheck module and run test.
 */

import {download, getProjectRoot} from '../lib/download';
import {shellcheck} from '../lib/shellcheck';

download();

const result = shellcheck([`${getProjectRoot()}/test/example.bash`]);

// We expect therer to be an error but should be one.
if (result.status != 1) {
    console.log(`ShellCheck test failed. Invalid return status: '${result.status}'`);
    console.log(result.stdout.toString());
    console.log(result.stderr.toString());
    process.exit(1);
} else {
    console.log(`ShellCheck return status '${result.status}' as expected.`);
}

if (result.stdout.includes('SC2086: Double quote to prevent globbing and word splitting')) {
    console.log('ShellCheck found expected \'SC2086\' error in output.');
} else {
    console.log('ShellCheck test failed. Missing expected \'SC2086\' error.');
    console.log(result.stdout.toString());
    console.log(result.stderr.toString());
    process.exit(2);
}

process.exit(0);
