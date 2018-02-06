// internal imports
const { argumentError, newline } = require('./constants');
const canHasAllFiles = require('./canHasAllFiles');
const getDirs = require('./getDirs');
const getFileString = require('./getFileString');
const shouldNotIgnoreDir = require('./shouldNotIgnoreDir');

function addToArray(array, possibleArray) {
    if (possibleArray && possibleArray.length > 0) {
        // this is to prevent from spreading individual chars in string
        if (Array.isArray(possibleArray)) {
            array.push(...possibleArray);
        } else {
            array.push(possibleArray);
        }
    }

    return array; // technically not necessary, as javascript will mutate the original array anyhow
}

module.exports = function getAllMatchingFilesUnderPath(currentPath, options) {
    var dirs = getDirs(currentPath);
    var files = canHasAllFiles(currentPath, options);
    var matchingFiles = addToArray([], files);

    if (dirs && dirs.length > 0) {
        dirs.forEach(currentDir => {
            if (shouldNotIgnoreDir(currentDir, options)) {
                // make recursive call to get more files or continue recursive stack
                var subDirFile = getAllMatchingFilesUnderPath(`${ currentPath }\\${ currentDir }`, options);
                matchingFiles = addToArray(matchingFiles, subDirFile);
            }
        });
    }

    if (matchingFiles.length > 0) {
        // this is to account for irregularity between:
        // - return from finding a matching file in calling directory (first couple lines of this method) and
        // - only finding a single file after recursive search
        // in other words, with only one file, always return a string, not an array.
        return matchingFiles.length == 1 ? matchingFiles[0] : matchingFiles;
    }

    return null;
}