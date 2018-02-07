const { argumentError, newline } = require('./constants.js');
const executeCommand = require('./executeCommand');

function canHasFile(filePath, options) {
    if (!filePath) throw new Error(argumentError);
    var canHasFileCommand = `dir ${filePath}\\*${options.fileType} \/a \/b`;
    var file = executeCommand(canHasFileCommand);
    return file && file != 'File Not Found' ? file.split(newline)[0] : null;
}

function canHasAllFiles(filePath, options) {
    if (!filePath) throw new Error(argumentError);
    var canHasFileCommand = `dir ${filePath}\\*${options.fileType} \/a \/b`;
    var files = executeCommand(canHasFileCommand);
    if (files && files != `File Not Found${newline}`) {
        files = files.split(newline);
        files.pop(); // remove trailing '' entry
        return files;
    }

    return null;
}

module.exports = {
    canHasFile: canHasFile,
    canHasAllFiles: canHasAllFiles,
}