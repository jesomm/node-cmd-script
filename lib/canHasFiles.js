const { argumentError, newline } = require('./constants.js');
const executeCommand = require('./executeCommand');

module.exports = function canHasFiles(filePath, options) {
    if (!filePath) throw new Error(argumentError);
    var canHasFileCommand = `dir ${filePath}\\*${options.fileType} \/a-d \/b`;
    var files = executeCommand(canHasFileCommand);
    if (files && files != `File Not Found${newline}`) {
        files = files.split(newline);
        files.pop(); // remove trailing '' entry
        return options.stopOnFirstMatch ? files[0] : files;
    }

    return null;
}
