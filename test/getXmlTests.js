const assert = require('assert');
const executeCommand = require('../executeCommand');
const { newline, getAllCsprojUnderPath } = require('../getXml');

describe('getXmlTests', () => {
    it('has a passing test', () => {
        assert.equal(true, true);
    });
});

describe('getAllCsprojUnderPath', () => {
    it('', () => {
        var path = executeCommand('cd').split(newline)[0];


    });
});


