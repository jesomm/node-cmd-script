const { execSync } = require('child_process');

const errorMark = 'ERROR: ';
const emptyStdout = 'empty stdout';

export function executeCommand(command) {
    var stdout = execSync(command);
    if (!stdout) {
        console.log(errorMark, emptyStdout);
        return;
    }
    return stdout.toString();
}
