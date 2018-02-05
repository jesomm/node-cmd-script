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
    if (options.shouldReturnPath) {
        if (options.shouldReturnRelativePath) {
            // not yet supported
        }
        return `${path}\\${file}`;
    }
    return file;
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

    return matchingFiles.length > 0 ? matchingFiles : null;
}

function getMatchingFilesUnderPath(path, options) {
    // protect against infinite recursion
    if (!options.ignoreDirs) options.ignoreDirs = [''];
    if (options.ignoreDirs.indexOf('') == -1) options.ignoreDirs.push('');

    options.startingPath = path;
    return getAllMatchingFilesUnderPath(options.startingPath, options);
}

module.exports = {
    newline: newline,
    getMatchingFilesUnderPath: getMatchingFilesUnderPath,
}