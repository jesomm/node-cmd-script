const fs = require('fs');
const { newline } = require('./constants');

function addToFile(file, possibleArray, isArray) {
    if (isArray) {
        possibleArray.forEach(thing => {
            fs.appendFileSync(file, `${thing}${newline}`);
        });
    } else if (file) {
        fs.appendFileSync(file, `${possibleArray}${newline}`);
    }

    fs.closeSync(file);
}

function addToArray(array, possibleArray, isArray) {
    if (isArray) {
        array.push(...possibleArray);
    } else {
        array.push(possibleArray);
    }

    return array;
}

module.exports = function addToOutput(output, possibleArray, options) {
    if (possibleArray == null) return output;

    const writeOutputToFile = options.writeOutputToFile;
    const isArray = possibleArray && Array.isArray(possibleArray);
    if (!output) {
        output = writeOutputToFile ? fs.openSync(options.outputFileName, 'a') : [];
    }

    return writeOutputToFile ?
        addToFile(output, possibleArray, isArray) :
        addToArray(output, possibleArray, isArray);
}