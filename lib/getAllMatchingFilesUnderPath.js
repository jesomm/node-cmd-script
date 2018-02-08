// internal imports
const addToOutput = require('./addToOutput');
const { argumentError, newline } = require('./constants');
const canHasFiles = require('./canHasFiles');
const getDirs = require('./getDirs');
const { getFileStrings } = require('./getFileStrings');
const shouldNotIgnoreDir = require('./shouldNotIgnoreDir');

module.exports = function getAllMatchingFilesUnderPath(currentPath, options) {
    var output = null;

    var files = canHasFiles(currentPath, options);
    if (files) {
        fileStrings = getFileStrings(files, currentPath, options)    
        output = addToOutput(output, fileStrings, options);
        if (options.stopOnFirstMatch) return output;
    }
    
    var dirs = getDirs(currentPath);
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
