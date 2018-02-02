const executeCommand = require('./executeCommand');

const newline = '\r\n';
const argumentError = 'ArgumentNullError';

function getDirs(path) {
    if (!path) throw new Error(argumentError);
    var getDirsCommand = `dir ${path} /ad /b`;
    var dirs = executeCommand(getDirsCommand, true);
    return dirs ? dirs.split(newline) : null;
}

function canHasCsproj(path) {
    if (!path) throw new Error(argumentError);
    var canHasCsprojCommand = `dir ${path}\\*.csproj \/a \/b`;
    var csproj = executeCommand(canHasCsprojCommand, true /* ignoreError */);
    return csproj != 'File Not Found' ? `${path}\\${csproj}` : null;
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

function getAllCsprojUnderPath(currentPath, startingPath) {
    // first look for a csproj
    var csproj = canHasCsproj(currentPath);
    if (csproj) {
        return currentPath + csproj;
    }

    // then look for subdirectories
    var dirs = getDirs(currentPath);
    var csprojs = [];
    dirs.forEach(currentDir => {
        if (shouldNotIgnoreDir(currentDir)) {
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

var path = executeCommand('cd').split(newline)[0];
getDirs(`${ currentPath }\\dir`);