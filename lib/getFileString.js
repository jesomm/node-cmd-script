const path = require('path');

function getFileString(file, whereExist, options) {
    var output = options.beforeFileString;
    var fileInfo;
    if (options.shouldReturnFullPath) {
        fileInfo = `${whereExist}\\${file}`;
    } else if (options.shouldReturnRelativePath) {
        var trimmedPath = whereExist.slice(options.relativePathLength);
        fileInfo = `${trimmedPath}\\${file}`
    } else {
        fileInfo = file;
    }
    output += path.normalize(fileInfo);
    output += options.afterFileString;

    return output;
}

function getAllFileStrings(files, whereExist, options) {
    var fileStrings = [];
    function getOneFileString(singleFile) {
        return fileStrings.push(getFileString(singleFile, whereExist, options));
    }

    if (Array.isArray(files)) {
        files.forEach(getOneFileString);
    } else if (files.length > 0) {
        getFileString(files);
    }

    return fileStrings.length > 0 ? fileStrings : null;
}

module.exports ={
    getFileString: getFileString,
    getAllFileStrings: getAllFileStrings,
}
