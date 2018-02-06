module.exports = function tryUpdateRelativePathInfo(searchPath, options) {
    var relativePath = options.relativePathTo;
    if (relativePath) {
        if (searchPath.indexOf(relativePath) != 0) throw new Error('specified relativePathTo not found at index 0 of calling path');
        options.relativePathLength = relativePath.length;    
    } else {
        options.relativePathLength = searchPath.length + 1;
    }

    return options;
}
