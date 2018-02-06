const fs = require('fs');
const path = require('path');
const executeCommand = require('./executeCommand');

const newline = '\r\n';
const argumentError = 'ArgumentNullError';
const alwaysIgnoreDirs = [''];

function getDirs(dirPath) {
    if (!dirPath) throw new Error(argumentError);
    var getDirsCommand = `dir ${dirPath} /ad /b`;
    var dirs = executeCommand(getDirsCommand);
    return dirs ? dirs.split(newline) : null;
}

function canHasFile(filePath, options) {
    if (!filePath) throw new Error(argumentError);
    var canHasFileCommand = `dir ${filePath}\\*${options.fileType} \/a \/b`;
    var file = executeCommand(canHasFileCommand);
    return file && file != 'File Not Found' ? file.split(newline)[0] : null;
}

/**
 * returns true when dir not in ignore list
 * @param {*} dir 
 */
function shouldNotIgnoreDir(dir, options) {
    return options.ignoreDirs.indexOf(dir) == -1;
}

function returnFileString(file, filePath, options) {
    var output = options.beforeFileString;
    var fileInfo;
    if (options.shouldReturnFullPath) {
        fileInfo = `${filePath}\\${file}`;
    } else if (options.shouldReturnRelativePath) {
        var trimmedPath = filePath.slice(options.relativePathLength);
        fileInfo = `${trimmedPath}\\${file}`
    } else {
        fileInfo = file;
    }
    output += path.normalize(fileInfo);
    output += options.afterFileString;

    return output;
}

function getAllMatchingFilesUnderPath(currentPath, options) {
    // first look for a matching file
    var file = canHasFile(currentPath, options);
    if (file) return returnFileString(file, currentPath, options);

    // then look for subdirectories
    var dirs = getDirs(currentPath);
    if (!dirs) return null;

    var matchingFiles = [];
    dirs.forEach(currentDir => {
        if (shouldNotIgnoreDir(currentDir, options)) {
            // make recursive call to get csproj or continue recursive stack
            var subDirFile = getAllMatchingFilesUnderPath(`${ currentPath }\\${ currentDir }`, options);
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

function tryUpdateRelativePathInfo(searchPath, options) {
    var relativePath = options.relativePathTo;
    if (relativePath) {
        if (searchPath.indexOf(relativePath) != 0) throw new Error('specified relativePathTo not found at index 0 of calling path');
        options.relativePathLength = relativePath.length;    
    } else {
        options.relativePathLength = searchPath.length + 1;
    }

    return options;
}

function getMatchingFilesUnderPath(searchPath, options) {
    // protect against infinite recursion
    if (!options.ignoreDirs) options.ignoreDirs = [''];
    if (options.ignoreDirs.indexOf('') == -1) options.ignoreDirs.push('');

    // ensure insert of empty string and not 'null' or 'undefined' to file string
    if (!options.beforeFileString) options.beforeFileString = '';
    if (!options.afterFileString) options.afterFileString = '';
    
    if (options.shouldReturnRelativePath) options = tryUpdateRelativePathInfo(searchPath, options);
    if (options.writeOutputToFile && !options.outputFileName) options.outputFileName = 'output.txt';

    var result = getAllMatchingFilesUnderPath(searchPath, options);
    if (options.writeOutputToFile) {
        fs.writeFileSync(options.outputFileName, result);
    } else {
        return result;
    }
}

module.exports = {
    newline: newline,
    getMatchingFilesUnderPath: getMatchingFilesUnderPath,
}