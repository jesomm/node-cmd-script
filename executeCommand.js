const { execSync } = require('child_process');

const errorMark = 'ERROR: ';
const emptyStdout = 'empty stdout';

module.exports = function executeCommand(command, ignoreError) {
    var stdout;
    try {
        stdout = execSync(command);
    } catch (e) {
        if (!ignoreError) {
            throw e;
        }
    }

    return stdout ? stdout.toString() : null;
}
