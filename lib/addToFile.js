const fs = require('fs');
const { newline } = require('./constants');

function addToFileOpen(file, possibleArray) {
    if (Array.isArray(possibleArray)) {
        possibleArray.forEach(thing => {
            fs.appendFileSync(file, `${thing}${newline}`);
        });
    } else if (file) {
        fs.appendFileSync(file, `${possibleArray}${newline}`);
    }
}

function addToFile(file, possibleArray) {
    addToFileOpen(file, possibleArray);
    fs.closeSync(file);
}

module.exports = {
    addToFile: addToFile,
    addToFileOpen: addToFileOpen,
}