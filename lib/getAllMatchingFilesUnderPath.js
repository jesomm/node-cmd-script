const fs = require('fs');

// internal imports
const { argumentError, newline } = require('./constants');
const canHasAllFiles = require('./canHasAllFiles');
const getDirs = require('./getDirs');
const getFileString = require('./getFileString');
const shouldNotIgnoreDir = require('./shouldNotIgnoreDir');

function addToFile(file, possibleArray, isArray) {
    if (!file) throw new Error(argumentError);

    if (isArray) {
        possibleArray.forEach(thing => {
            fs.appendFileSync(file, thing);
        });
    } else {
        fs.appendFileSync(file, possibleArray);
    }

    fs.closeSync(file);
}

function addToArray(array, possibleArray, isArray) {
    if (isArray) {
        array.push(...possibleArray);
    } else {
        array.push(possibleArray);
    }

    return array;
}

function addToOutput(output, possibleArray, options) {
    const writeOutputToFile = options.writeOutputToFile;
    const isArray = possibleArray && Array.isArray(possibleArray);
    if (!output) {
        output = writeOutputToFile ? fs.openSync(options.outputFileName, 'a') : [];
    }

    return writeOutputToFile ?
        addToFile(output, possibleArray, isArray) :
        addToArray(output, possibleArray, isArray);
}

module.exports = function getAllMatchingFilesUnderPath(currentPath, options) {
    var dirs = getDirs(currentPath);
    var files = canHasAllFiles(currentPath, options);    
    var output = addToOutput(null, files, options);

    if (dirs && dirs.length > 0) {
        dirs.forEach(currentDir => {
            if (shouldNotIgnoreDir(currentDir, options)) {
                // make recursive call to get more files or continue recursive stack
                var subDirFile = getAllMatchingFilesUnderPath(`${ currentPath }\\${ currentDir }`, options);
                output = addToOutput(output, subDirFile, options);
            }
        });
    }

    if (output.length > 0) {
        // this is to account for irregularity between:
        // - return from finding a matching file in calling directory (first couple lines of this method) and
        // - only finding a single file after recursive search
        // in other words, with only one file, always return a string, not an array.
        return output.length == 1 ? output[0] : output;
    }

    return null;
}