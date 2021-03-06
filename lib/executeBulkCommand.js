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
                surprise = executeCommand(whatCouldPossiblyGoWrong, false);
            } catch (e) {
                if (errorFile) addToFileOpen(errorFile, e);
                if (!isOutputFile) output = addToArray(output, e);
                if (options.stopOnError) throw e;
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
    
    try {
        if (Array.isArray(possibleArray)) {
            possibleArray.forEach(executeOneCommand);
        } else {
            executeOneCommand(possibleArray);
        }
    } catch (e) {};

    if (output && errorFile) {
        fs.closeSync(output);
        fs.closeSync(errorFile);
    }

    return output && output.length > 0 ? output : null;
}

module.exports = {
    executeBulkCommand: executeBulkCommand,
}
