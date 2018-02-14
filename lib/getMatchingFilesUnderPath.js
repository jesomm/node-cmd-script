const tryUpdateRelativePathInfo = require('./tryUpdateRelativePathInfo');
const getAllMatchingFilesUnderPath = require('./getAllMatchingFilesUnderPath');
const alwaysIgnoreDir = '';

function getMatchingFilesUnderPath(searchPath, options) {
    // force default any file, not default *undefined ;)
    if (!options.fileType) options.fileType = '';

    // protect against infinite recursion
    if (!options.ignoreDirs) options.ignoreDirs = [alwaysIgnoreDir];
    if (options.ignoreDirs.indexOf(alwaysIgnoreDir) == -1) options.ignoreDirs.push(alwaysIgnoreDir);

    // force default stopOnFirstMatch search
    if (options.stopOnFirstMatch == undefined) options.stopOnFirstMatch = true;

    if (!options.fileStringTemplate) options.fileStringTemplate = '{0}';
    if (options.testBulkOperation) options.runBulkOperation = true;

    // must be before tryUpdateRelativePathInfo, as it intentionally changes the behavior
    if (options.mirrorDirectoryStructure) {
        if (!options.mirrorWhere) throw new Error('mirrorWhere required for mirrorDirectoryStructure');
        options.shouldReturnRelativePath = true;
        if (!options.relativePathTo) options.relativePathTo = searchPath;
    }

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
