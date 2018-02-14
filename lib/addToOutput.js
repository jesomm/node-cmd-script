const fs = require('fs');
const path = require('path');
const addToArray = require('./addToArray');
const { addToFile } = require('./addToFile');
const executeCommand = require('./executeCommand');
const { executeBulkCommand } = require('./executeBulkCommand');
const { getFileString } = require('./getFileStrings');

const mkdirCommand = 'mkdir';
const noFile = '';
module.exports = function addToOutput(output, possibleArray, options, path) {
    if (possibleArray == null) return output;

    const writeOutputToFile = options.writeOutputToFile;
    if (!output) {
        output = writeOutputToFile ? fs.openSync(options.outputFileName, 'a') : [];
    }

    if (options.mirrorDirectoryStructure) {
        var pathToCreate = getFileString(noFile, path, options);
        pathToCreate = `${options.mirrorWhere}${pathToCreate}`;
        executeCommand(`${mkdirCommand} ${pathToCreate}`);
    }
    
    var next, errorFile;
    if (options.runBulkOperation) {
        next = executeBulkCommand;
        if (writeOutputToFile) errorFile = fs.openSync(options.errorFileName, 'a');
    } else if (writeOutputToFile) {
        next = addToFile;
    } else {
        next = addToArray;
    }

    return next(output, possibleArray, options, errorFile);
}