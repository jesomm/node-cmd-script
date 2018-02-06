/**
 * returns true when dir not in ignore list
 * @param {*} dir 
 */
module.exports = function shouldNotIgnoreDir(dir, options) {
    return options.ignoreDirs.indexOf(dir) == -1;
}
