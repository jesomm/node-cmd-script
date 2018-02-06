const { argumentError, newline } = require('./constants.js');
const executeCommand = require('./executeCommand');

module.exports = function getDirs(dirPath) {
    if (!dirPath) throw new Error(argumentError);
    var getDirsCommand = `dir ${dirPath} /ad /b`;
    var dirs = executeCommand(getDirsCommand);
    return dirs ? dirs.split(newline) : null;
}
