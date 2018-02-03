var should = require('should');
const executeCommand = require('../executeCommand');
const { newline, getAllCsprojUnderPath } = require('../getXml');

describe('getXmlTests', () => {
    it('has a passing test', () => {
        true.should.be.true;
    });
});

describe('getAllCsprojUnderPath', () => {
    it('stops searching recursively in a file path once it finds the least-deep csproj', () => {
        var path = executeCommand('cd').split(newline)[0];
        path = `${path}\\test\\dir`;
        var result = getAllCsprojUnderPath(path, false);

        (result.indexOf('dir3.2.1.1_IGNORED.csproj') > -1).should.be.false;
        (result.indexOf('dir3.2.1.csproj') > -1).should.be.true;
    });

    it('gets all the things that matter and none of the things that do not', () => {
        var path = executeCommand('cd').split(newline)[0];
        path = `${path}\\test\\dir`;
        var result = getAllCsprojUnderPath(path, false);

        (result.indexOf('IGNORE_ME.csproj') > -1).should.be.false;
        (result.indexOf('dir3.2.2.csproj') > -1).should.be.true;
    });
});
