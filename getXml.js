const { execSync } = require('child_process');

const errorMark = 'ERROR: ';
const emptyStdout = 'empty stdout';

const getDirsCommand = 'dir /ad /b'; // outputs dirs on newlines
function getDirs() {
    var stdout = execSync(getDirsCommand);
    if (!stdout) {
        console.log(errorMark, emptyStdout);
        return;
    }
    var dirs = stdout.toString();

    return dirs.split('\r\n'); // windows; could make env-based if needed
}

const whereAmICommand = 'cd';
function whereAmI() {
    var stdout = execSync(whereAmICommand);
    if (!stdout) {
        console.log(errorMark, emptyStdout);
        return;
    }

    console.log(stdout);
}


const goCommand = whereAmICommand + ' ';
function go(overThere) {
    execSync(goCommand + overThere);
}
