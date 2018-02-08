const tryUpdateRelativePathInfo = require('./tryUpdateRelativePathInfo');
const getAllMatchingFilesUnderPath = require('./getAllMatchingFilesUnderPath');
const alwaysIgnoreDir = '';

function getMatchingFilesUnderPath(searchPath, options) {
    // protect against infinite recursion
    if (!options.ignoreDirs) options.ignoreDirs = [alwaysIgnoreDir];
    if (options.ignoreDirs.indexOf(alwaysIgnoreDir) == -1) options.ignoreDirs.push(alwaysIgnoreDir);

    // ensure insert of empty string and not 'null' or 'undefined' to file string
    if (!options.beforeFileString) options.beforeFileString = '';
    if (!options.afterFileString) options.afterFileString = '';
    
    if (options.shouldReturnRelativePath) options = tryUpdateRelativePathInfo(searchPath, options);
    if (options.writeOutputToFile && !options.outputFileName) options.outputFileName = 'output.txt';

    var useExpensiveSearchForAllMatches = false;
    if (options.stopOnFirstMatch == undefined) {
        options.stopOnFirstMatch = true;
    }

    return getAllMatchingFilesUnderPath(searchPath, options);
}

module.exports = {
    getMatchingFilesUnderPath: getMatchingFilesUnderPath,
}
