const execute = require('./executeCommand');

const errorMark = 'ERROR: ';
const emptyStdout = 'empty stdout';

const getDirsCommand = 'dir /ad /b'; // outputs dirs on newlines with always empty newline at end
function getDirs() {
    var dirs = execute(getDirsCommand);
    return dirs.split('\r\n');
}

const whereAmICommand = 'cd';
function whereAmI() {
    var here = execute(whereAmICommand);
    console.log("You're in: ", here);
}

const goCommand = whereAmICommand + ' ';
function go(overThere) {
    execute(goCommand + overThere);
}
