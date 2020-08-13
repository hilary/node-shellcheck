/**
 * Load shellcheck module and run test.
 */

import {shellcheck} from 'node-shellcheck';

const result = shellcheck(['example.bash']);

// We expect therer to be an error but should be one.
if (result.status != 1) {
    console.log(`ShellCheck test failed. Invalid return status: '${result.status}'`);
    process.exit(1);
} else {
    console.log(`ShellCheck return status '${result.status}' as expected.`);
}

if (result.stdout.includes('SC2086: Double quote to prevent globbing and word splitting')) {
    console.log('ShellCheck test found expected \'SC2086\' error.');
} else {
    console.log('ShellCheck test failed. Missing expected \'SC2086\' error.');
    process.exit(2);
}

process.exit(0);
