const executeCommand = require('./executeCommand');

const newline = '\r\n';
const argumentError = 'ArgumentNullError';

function getDirs(path) {
    if (!path) throw new Error(argumentError);
    var getDirsCommand = `dir ${path} /ad /b`;
    var dirs = executeCommand(getDirsCommand);
    return dirs ? dirs.split(newline) : null;
}

function canHasCsproj(path) {
    if (!path) throw new Error(argumentError);
    var canHasCsprojCommand = `dir ${path}\\*.csproj \/a \/b`;
    var csproj = executeCommand(canHasCsprojCommand);
    return csproj && csproj != 'File Not Found' ? csproj : null;
}

const sdIgnoreDirs = ['obj', 'bin', ''];
const csprojIgnoreDirs = [...sdIgnoreDirs, '.git', 'node_modules'];

/**
 * returns true when dir not in ignore list
 * @param {*} dir 
 */
function shouldNotIgnoreDir(dir) {
    return csprojIgnoreDirs.indexOf(dir) == -1;
}

function getAllCsprojUnderPath(currentPath, shouldReturnFullCsprojPath) {
    // first look for a csproj
    var csproj = canHasCsproj(currentPath);
    if (csproj) return shouldReturnFullCsprojPath ? `${currentPath}\\${csproj}` : csproj;

    // then look for subdirectories
    var dirs = getDirs(currentPath);
    if (!dirs) return null;

    var csprojs = [];
    dirs.forEach(currentDir => {
        if (shouldNotIgnoreDir(currentDir)) {
            // make recursive call to get csproj or continue recursive stack
            var subDirCsproj = getAllCsprojUnderPath(`${ currentPath }\\${ currentDir }`);
            if (subDirCsproj && subDirCsproj.length > 0) {
                if (Array.isArray(subDirCsproj)) { // otherwise it spreads individual char -_-'
                    csprojs.push(...subDirCsproj);
                } else {
                    csprojs.push(subDirCsproj);
                }
            }
        }
    });

    return csprojs.length > 0 ? csprojs : null;
}

module.exports = {
    newline: newline,
    getAllCsprojUnderPath: getAllCsprojUnderPath,
    canHasCsproj: canHasCsproj,
    getDirs: getDirs
}