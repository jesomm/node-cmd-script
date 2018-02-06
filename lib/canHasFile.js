const { argumentError, newline } = require('./constants.js');
const executeCommand = require('./executeCommand');

module.exports = function canHasFile(filePath, options) {
    if (!filePath) throw new Error(argumentError);
    var canHasFileCommand = `dir ${filePath}\\*${options.fileType} \/a \/b`;
    var file = executeCommand(canHasFileCommand);
    return file && file != 'File Not Found' ? file.split(newline)[0] : null;
}