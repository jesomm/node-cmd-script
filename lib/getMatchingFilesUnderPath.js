const fs = require('fs');
const tryUpdateRelativePathInfo = require('./tryUpdateRelativePathInfo');
const getFirstMatchingFileUnderPath = require('./getFirstMatchingFileUnderPath');
const alwaysIgnoreDirs = [''];

function getMatchingFilesUnderPath(searchPath, options) {
    // protect against infinite recursion
    if (!options.ignoreDirs) options.ignoreDirs = [''];
    if (options.ignoreDirs.indexOf('') == -1) options.ignoreDirs.push('');

    // ensure insert of empty string and not 'null' or 'undefined' to file string
    if (!options.beforeFileString) options.beforeFileString = '';
    if (!options.afterFileString) options.afterFileString = '';
    
    if (options.shouldReturnRelativePath) options = tryUpdateRelativePathInfo(searchPath, options);
    if (options.writeOutputToFile && !options.outputFileName) options.outputFileName = 'output.txt';

    var result = getFirstMatchingFileUnderPath(searchPath, options);
    if (options.writeOutputToFile) {
        fs.writeFileSync(options.outputFileName, result);
    } else {
        return result;
    }
}

module.exports = {
    getMatchingFilesUnderPath: getMatchingFilesUnderPath,
}