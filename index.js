/**
 * Simple wrapper around the install function in case install script has
 * not yet been generated yet.
 */

try {
    // Requiring it will run install directly.
    const install = require('./dist/bin/install.js');
} catch {
    console.log('Install script not yet generated.');
}
