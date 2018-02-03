var should = require('should');
const executeCommand = require('../executeCommand');
const { newline, getAllCsprojUnderPath } = require('../getXml');

describe('getAllCsprojUnderPath()', () => {
    it('returns null when there are no csproj in the calling path or any subfolder below it', () => {
        true.should.be.false;
    });

    it('returns a matching file', () => {
        true.should.be.false;
    });

    it('ignores non-matching files', () => {
        true.should.be.false;
    });

    it('ignores banned directories', () => {
        true.should.be.false;
    });

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
    
    it('returns filenames when requested', () => {
        true.should.be.false;
    });
    
    it('returns paths comparative to starting path when requested', () => {
        true.should.be.false;
    });

    it('returns full file paths when requested', () => {
        true.should.be.false;
    });
});