const tryUpdateRelativePathInfo = require('./tryUpdateRelativePathInfo');
const getAllMatchingFilesUnderPath = require('./getAllMatchingFilesUnderPath');
const alwaysIgnoreDir = '';

function getMatchingFilesUnderPath(searchPath, options) {

    // protect against infinite recursion
    if (!options.ignoreDirs) options.ignoreDirs = [alwaysIgnoreDir];
    if (options.ignoreDirs.indexOf(alwaysIgnoreDir) == -1) options.ignoreDirs.push(alwaysIgnoreDir);

    if (options.stopOnFirstMatch == undefined) options.stopOnFirstMatch = true; // force default stopOnFirstMatch search
    if (!options.fileStringTemplate) options.fileStringTemplate = '{0}';
    if (options.testBulkOperation) options.runBulkOperation = true;

    if (options.shouldReturnRelativePath) options = tryUpdateRelativePathInfo(searchPath, options);
    if (options.writeOutputToFile) {
        if (!options.outputFileName) options.outputFileName = 'output.txt';
        if (options.runBulkOperation && !options.errorFileName) options.errorFileName = 'error.txt';
    }
    
    return getAllMatchingFilesUnderPath(searchPath, options);
}

module.exports = {
    getMatchingFilesUnderPath: getMatchingFilesUnderPath,
}
