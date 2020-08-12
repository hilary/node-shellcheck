/**
 * Load shellcheck module and run test.
 */

import {shellcheck} from 'node-shellcheck';

const result = shellcheck(['example.bash']);

console.log(`ShellCheck result: ${result.code}`);

// We expect therer to be an error but should be one.
if (result.code != 1) {
    console.log('ShellCheck test failed. Invalid return code.');
    process.exit(1);
}

if (result.stdout.includes('SC2086: Double quote to prevent globbing and word splitting')) {
    console.log('ShellCheck test found expected \'SC2086\' error.');
} else {
    console.log('ShellCheck test failed. Missing expected \'SC2086\' error.');
    process.exit(2);
}

process.exit(0);
