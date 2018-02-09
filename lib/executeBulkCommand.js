const fs = require('fs');
const executeCommand = require('./executeCommand');
const addToArray = require('./addToArray');
const { addToFileOpen } = require('./addToFile');
const { newline } = require('./constants');

function executeBulkCommand(output, possibleArray, options, errorFile) {
    const isOutputFile = !Array.isArray(output);
    
    function executeOneCommand(whatCouldPossiblyGoWrong) {
        var surprise = null;
        if (options.runBulkOperation && !options.testBulkOperation)
        {
            try {
                surprise = executeCommand(whatCouldPossiblyGoWrong);
            } catch (e) {
                if (errorFile) addToFileOpen(errorFile, e);
            }
        } else if (options.testBulkOperation) {
            surprise = whatCouldPossiblyGoWrong;
        }
        
        if (surprise && output) {
            if (isOutputFile) {
                addToFileOpen(output, surprise);
            } else {
                output = addToArray(output, surprise);
            }
        }
    }

    
    if (Array.isArray(possibleArray)) {
        possibleArray.forEach(executeOneCommand);
    } else {
        executeOneCommand(possibleArray);
    }

    if (output && errorFile) {
        fs.closeSync(output);
        fs.closeSync(errorFile);
    }

    return output && output.length > 0 ? output : null;
}

module.exports = {
    executeBulkCommand: executeBulkCommand,
}
