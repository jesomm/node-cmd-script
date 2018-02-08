const should = require('should');
const fs = require('fs');
const path = require('path');
const executeCommand = require('../lib/executeCommand');
const { getMatchingFilesUnderPath } = require('../lib/getMatchingFilesUnderPath');
const { newline } = require('../lib/constants');

describe('getMatchingFilesUnderPath()-- with stopOnFirstMatch flag undefined or true', () => {
    var currentPath = executeCommand('cd').split(newline)[0];

    it('returns a matching file', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);

        var options = {
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(testPath, options);

        result.should.containEql('dir1.csproj');
    });

    it('stops searching recursively in a file path once it finds the least-deep matching file', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir3`);
        
        var options = {
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(testPath, options);

        result.should.not.containEql('dir3.2.1.1_IGNORE_ME.csproj');
        result.should.containEql('dir3.2.1.csproj');
    });

    it('returns first found matching file even when there are multiple matches in a given directory', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir2`);

        var options = {
            fileType: '.*',
        }

        var result = getMatchingFilesUnderPath(testPath, options);

        result.length.should.equal(1);
    });
});