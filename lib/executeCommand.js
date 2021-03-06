const { execSync } = require('child_process');

module.exports = function executeCommand(command, ignoreError = true) {
    var stdout;
    try {
        stdout = execSync(command, { stdio:  ['pipe', 'pipe', 'pipe'] });
    } catch (e) {
        if (!ignoreError) {
            throw e;
        }
    }

    return stdout ? stdout.toString() : null;
}
