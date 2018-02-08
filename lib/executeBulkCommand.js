const fs = require('fs');
const executeCommand = require('./executeCommand');

function executeBulkCommand(output, possibleArray, options, errorFile) {
    const isOutputFile = !Array.isArray(output);
    
    function executeOneCommand(whatCouldPossiblyGoWrong) {
        var surprise = null;
        var stillPossiblyDangerousCommand;
        if (options.isTestMode) stillPossiblyDangerousCommand = `echo ${whatCouldPossiblyGoWrong}`;
        try {
            surprise = executeCommand(stillPossiblyDangerousCommand || whatCouldPossiblyGoWrong);
        } catch (e) {
            if (errorFile) fs.appendFileSync(errorFile, e);
        }

        if (surprise && output) {
            if (isOutputFile) {
                fs.appendFileSync(output, surprise);
            } else {
                output.push(surprise);
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
