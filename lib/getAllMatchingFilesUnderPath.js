// internal imports
const addToOutput = require('./addToOutput');
const { argumentError, newline } = require('./constants');
const { canHasAllFiles } = require('./canHasFile');
const getDirs = require('./getDirs');
const { getAllFileStrings } = require('./getFileString');
const shouldNotIgnoreDir = require('./shouldNotIgnoreDir');

module.exports = function getAllMatchingFilesUnderPath(currentPath, options) {
    var output = null;
    var dirs = getDirs(currentPath);
    var files = canHasAllFiles(currentPath, options);

    if (files) {
        fileStrings = getAllFileStrings(files, currentPath, options)    
        output = addToOutput(output, fileStrings, options);
    }

    if (dirs && dirs.length > 0) {
        dirs.forEach(currentDir => {
            if (shouldNotIgnoreDir(currentDir, options)) {
                // make recursive call to get more files or continue recursive stack
                var subDirFile = getAllMatchingFilesUnderPath(`${ currentPath }\\${ currentDir }`, options);
                output = addToOutput(output, subDirFile, options);
            }
        });
    }

    return output;
}