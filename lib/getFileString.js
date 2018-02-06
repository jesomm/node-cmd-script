const path = require('path');

module.exports = function getFileString(file, filePath, options) {
    var output = options.beforeFileString;
    var fileInfo;
    if (options.shouldReturnFullPath) {
        fileInfo = `${filePath}\\${file}`;
    } else if (options.shouldReturnRelativePath) {
        var trimmedPath = filePath.slice(options.relativePathLength);
        fileInfo = `${trimmedPath}\\${file}`
    } else {
        fileInfo = file;
    }
    output += path.normalize(fileInfo);
    output += options.afterFileString;

    return output;
}
