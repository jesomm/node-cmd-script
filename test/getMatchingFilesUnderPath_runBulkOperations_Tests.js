const should = require('should');
const fs = require('fs');
const path = require('path');
const executeCommand = require('../lib/executeCommand');
const { getMatchingFilesUnderPath } = require('../lib/getMatchingFilesUnderPath');
const { newline } = require('../lib/constants');

describe('getMatchingFilesUnderPath()-- with runBulkOperations flag set to true', () => {
    var currentPath = executeCommand('cd').split(newline)[0];

    it('runs the command as generated for each matching file when runBulkOperation is true', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir3\\d3.1`);
        
        var options = {
            runBulkOperation: true,
            fileStringTemplate: 'echo "{0} {1}"',
            fileType: '.*',
        }
        
        var result = getMatchingFilesUnderPath(testPath, options);
        
        result.should.containEql('intentional test failure');
    });
    
    it('echos each command as generated when testBulkOperation is true', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir3\\d3.1`);
        
        var options = {
            testBulkOperation: true,
            fileStringTemplate: 'git mv "F:\\oldLocation\\{0}" "F:\\newFolder\\{1}"',
            fileType: '.*',
        }
        
        var result = getMatchingFilesUnderPath(testPath, options);
        
        result.should.containEql('intentional test failure');
    });

    it('ignores runBulkOperation flag when testBulkOperation is set to true', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir3\\d3.1`);
        
        var options = {
            runBulkOperation: true,
            testBulkOperation: true,
            fileStringTemplate: 'git mv "F:\\oldLocation\\{0}" "F:\\newFolder\\{1}"',
            fileType: '.*',
        }
        
        var result = getMatchingFilesUnderPath(testPath, options);
        
        result.should.containEql('intentional test failure');
    });
});