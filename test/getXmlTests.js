var chai = require('chai'), expect = chai.expect;
const executeCommand = require('../executeCommand');
const { newline, getAllCsprojUnderPath } = require('../getXml');

describe('getXmlTests', () => {
    it('has a passing test', () => {
        var thing = true;
        expect(thing).to.equal(true);
    });
});

describe('getAllCsprojUnderPath', () => {
    it('gets all the things that matter and none of the things that do not', () => {
        var path = executeCommand('cd').split(newline)[0];
        path = `${path}\\test\\dir`;
        var result = getAllCsprojUnderPath(path);
        expect(result).to.equal('foo');
    });
});


