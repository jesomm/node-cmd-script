const fs = require('fs');
const { newline } = require('./constants');
const { executeBulkCommand } = require('./executeBulkCommand');

function addToFile(file, possibleArray) {
    if (Array.isArray(possibleArray)) {
        possibleArray.forEach(thing => {
            fs.appendFileSync(file, `${thing}${newline}`);
        });
    } else if (file) {
        fs.appendFileSync(file, `${possibleArray}${newline}`);
    }

    fs.closeSync(file);
}

function addToArray(array, possibleArray) {
    if (Array.isArray(possibleArray)) {
        array.push(...possibleArray);
    } else {
        array.push(possibleArray);
    }

    return array;
}


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