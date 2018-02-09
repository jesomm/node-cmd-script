module.exports = function addToArray(array, possibleArray) {
    if (Array.isArray(possibleArray)) {
        array.push(...possibleArray);
    } else {
        array.push(possibleArray);
    }

    return array;
}
