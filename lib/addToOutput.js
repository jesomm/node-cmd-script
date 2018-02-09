const fs = require('fs');
const addToArray = require('./addToArray');
const { addToFile } = require('./addToFile');
const { executeBulkCommand } = require('./executeBulkCommand');

module.exports = function addToOutput(output, possibleArray, options) {
    if (possibleArray == null) return output;

    const writeOutputToFile = options.writeOutputToFile;
    if (!output) {
        output = writeOutputToFile ? fs.openSync(options.outputFileName, 'a') : [];
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