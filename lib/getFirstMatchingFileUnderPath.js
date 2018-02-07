// internal imports
const addToOutput = require('./addToOutput');
const { argumentError, newline } = require('./constants');
const { canHasFile } = require('./canHasFile');
const getDirs = require('./getDirs');
const { getFileString } = require('./getFileString');
const shouldNotIgnoreDir = require('./shouldNotIgnoreDir');

module.exports = function getFirstMatchingFileUnderPath(currentPath, options) {
    var output = null;

    // first look for a matching file
    var file = canHasFile(currentPath, options);
    if (file) {
        fileString = getFileString(file, currentPath, options);
        return addToOutput(output, fileString, options);
    } 
    
    // then look for subdirectories
    var dirs = getDirs(currentPath);
    if (dirs && dirs.length) {
        dirs.forEach(currentDir => {
            if (shouldNotIgnoreDir(currentDir, options)) {
                // make recursive call to get csproj or continue recursive stack
                var subDirFile = getFirstMatchingFileUnderPath(`${ currentPath }\\${ currentDir }`, options);
                output = addToOutput(output, subDirFile, options);
            }
        });
    }

    return output;
}