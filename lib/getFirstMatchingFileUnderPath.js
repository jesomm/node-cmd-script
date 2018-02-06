// internal imports
const { argumentError, newline } = require('./constants');
const canHasFile = require('./canHasFile');
const getDirs = require('./getDirs');
const getFileString = require('./getFileString');
const shouldNotIgnoreDir = require('./shouldNotIgnoreDir');

module.exports = function getFirstMatchingFileUnderPath(currentPath, options) {
    // first look for a matching file
    var file = canHasFile(currentPath, options);
    if (file) return getFileString(file, currentPath, options);
    
    // then look for subdirectories
    var dirs = getDirs(currentPath);
    if (!dirs) return null;
    
    var matchingFiles = [];
    dirs.forEach(currentDir => {
        if (shouldNotIgnoreDir(currentDir, options)) {
            // make recursive call to get csproj or continue recursive stack
            var subDirFile = getFirstMatchingFileUnderPath(`${ currentPath }\\${ currentDir }`, options);
            if (subDirFile && subDirFile.length > 0) {
                if (Array.isArray(subDirFile)) { // otherwise it spreads individual char -_-'
                    matchingFiles.push(...subDirFile);
                } else {
                    matchingFiles.push(subDirFile);
                }
            }
        }
    });

    if (matchingFiles.length > 0) {
        // this is to account for irregularity between:
        // - return from finding a matching file in calling directory (first couple lines of this method) and
        // - only finding a single file after recursive search
        // in other words, with only one file, always return a string, not an array.
        return matchingFiles.length == 1 ? matchingFiles[0] : matchingFiles;
    }

    return null;
}