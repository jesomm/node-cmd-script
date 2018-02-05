const executeCommand = require('./executeCommand');

const newline = '\r\n';
const argumentError = 'ArgumentNullError';
const alwaysIgnoreDirs = [''];

function getDirs(path) {
    if (!path) throw new Error(argumentError);
    var getDirsCommand = `dir ${path} /ad /b`;
    var dirs = executeCommand(getDirsCommand);
    return dirs ? dirs.split(newline) : null;
}

function canHasFile(path, options) {
    if (!path) throw new Error(argumentError);
    var canHasFileCommand = `dir ${path}\\*${options.fileType} \/a \/b`;
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

function returnFileString(file, path, options) {
    if (options.shouldReturnFullPath) {
        return `${options.beforeFileString}${path}\\${file}${options.afterFileString}`;
    }

    if (options.shouldReturnRelativePath) {
        var trimmedPath = path.slice(options.startingPathLength);
        return `${options.beforeFileString}${trimmedPath}\\${file}${options.afterFileString}`
    }
    return `${options.beforeFileString}${file}${options.afterFileString}`;
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

function getMatchingFilesUnderPath(path, options) {
    // protect against infinite recursion
    if (!options.ignoreDirs) options.ignoreDirs = [''];
    if (options.ignoreDirs.indexOf('') == -1) options.ignoreDirs.push('');

    // ensure we insert empty string and not 'null' or 'undefined' to file string
    if (!options.beforeFileString) options.beforeFileString = '';
    if (!options.afterFileString) options.afterFileString = '';
    
    options.startingPathLength = path.length + 1; // account for trailing slash
    return getAllMatchingFilesUnderPath(path, options);
}

module.exports = {
    newline: newline,
    getMatchingFilesUnderPath: getMatchingFilesUnderPath,
}