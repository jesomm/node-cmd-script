const format = require('string-format');
const fs = require('fs');
const path = require('path');
const should = require('should');
const executeCommand = require('../lib/executeCommand');
const getDirs = require('../lib/getDirs');
const { getMatchingFilesUnderPath } = require('../lib/getMatchingFilesUnderPath');
const { newline } = require('../lib/constants');

describe('getMatchingFilesUnderPath()-- with mirrorDirectoryStructure flag set to true', () => {
    const currentPath = executeCommand('cd').split(newline)[0];
    const clearDirCommand = 'rmdir {} /s /q'; // /s to remove all; /q to do so quietly
    const testMirrorPath = `\\test\\theBestLocation`;
    const normalizedFullMirrorPath = path.normalize(`${currentPath}${testMirrorPath}`);
    const normalizedRemovePart = path.normalize(`${currentPath}\\test`);

    it('throws if mirrorWhere is not set', () => {
        var testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);
        var options = {
            mirrorDirectoryStructure: true,
        }

        var caughtException;
        try {
            getMatchingFilesUnderPath(testPath, options)
        } catch (e) {
            caughtException = e;
        }
        should.exist(caughtException);
    });

    it('mirrors the directory structure against passed in relativePathTo n_n', () => {
        var testPath = path.normalize(`${currentPath}\\test\\dir`);
        var options = {
            fileType: '.csproj',
            mirrorDirectoryStructure: true,
            mirrorWhere: normalizedFullMirrorPath,
            relativePathTo: normalizedRemovePart,
        }

        getMatchingFilesUnderPath(testPath, options);

        // assert first level
        var mirrorDirs = getDirs(normalizedFullMirrorPath);
        mirrorDirs.should.containEql('dir');

        // check one level deep as well
        mirrorDirs = getDirs(path.normalize(`${normalizedFullMirrorPath}\\dir`));
        mirrorDirs.should.containEql('dir2');
    });

    it('or against calling path if no relativePathTo is passed in', () => {
        var testPath = path.normalize(`${currentPath}\\test\\dir\\dir3`);
        var options = {
            mirrorDirectoryStructure: true,
            mirrorWhere: normalizedFullMirrorPath,
        }

        getMatchingFilesUnderPath(testPath, options);

        // assert first level
        var mirrorDirs = getDirs(normalizedFullMirrorPath);
        mirrorDirs.should.containEql('dir3.1');

        // check one level deep as well
        mirrorDirs = getDirs(path.normalize(`${normalizedFullMirrorPath}\\dir3.2`));
        mirrorDirs.should.containEql('dir3.2.2');
    });

    afterEach(() => {
        var clearCommand = format(clearDirCommand, normalizedFullMirrorPath);
        executeCommand(clearCommand);
    });
});