const should = require('should');
const fs = require('fs');
const path = require('path');
const executeCommand = require('../lib/executeCommand');
const { getMatchingFilesUnderPath } = require('../lib/getMatchingFilesUnderPath');
const { newline } = require('../lib/constants');

describe('getMatchingFilesUnderPath()-- with stopOnFirstMatch flag set to false, aka getAllMatches', () => {
    var currentPath = executeCommand('cd').split(newline)[0];

    it('returns null when there are no matching files in the calling path or any subfolder below it', () => {
        var testPath = path.normalize(`${currentPath}\\test\\dir\\dir3\\d3.1`);
        var options = {
            fileType: '.csproj',
            stopOnFirstMatch: false,
        }

        var result = getMatchingFilesUnderPath(testPath, options);

        should.not.exist(result); // have to write weird, because null does not inherit should
    });

    it('returns a matching file', () => {
        var testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);
        var options = {
            fileType: '.csproj',
            stopOnFirstMatch: false,
        }

        var result = getMatchingFilesUnderPath(testPath, options);

        result.should.containEql('dir1.csproj');
    });

    it('returns all matching files', () => {
        var testPath = path.normalize(`${currentPath}\\test\\dir\\dir2`);
        var options = {
            stopOnFirstMatch: false,
        }

        var result = getMatchingFilesUnderPath(testPath, options);

        result.should.containEql('dir2.1.csproj');
        result.should.containEql('IGNORE_ME.md');
    });

    it('keeps searching recursively in a file path when it finds the least-deep matching file', () => {
        var testPath = path.normalize(`${currentPath}\\test\\dir\\dir3`);
        var options = {
            fileType: '.csproj',
            stopOnFirstMatch: false,
        }

        var result = getMatchingFilesUnderPath(testPath, options);

        result.should.containEql('dir3.2.1.1_IGNORE_ME.csproj');
        result.should.containEql('dir3.2.1.csproj');
    });
});