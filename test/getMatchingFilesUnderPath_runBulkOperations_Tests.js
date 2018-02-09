const should = require('should');
const fs = require('fs');
const path = require('path');
const executeCommand = require('../lib/executeCommand');
const { getMatchingFilesUnderPath } = require('../lib/getMatchingFilesUnderPath');
const { newline } = require('../lib/constants');

describe('getMatchingFilesUnderPath()-- with runBulkOperations flag set to true', () => {
    var currentPath = executeCommand('cd').split(newline)[0];

    it('executes commands as generated for each matching file when runBulkOperation is true', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);
        
        var options = {
            fileStringTemplate: 'echo "{0} {1}"',
            fileType: '.*',
            runBulkOperation: true,
        }
        
        var result = getMatchingFilesUnderPath(testPath, options);
        var firstResult = result[0];

        firstResult.should.containEql('"dir1.csproj dir1.csproj"');
    });
    
    it('returns each command as generated when testBulkOperation is true', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);
        
        var options = {
            fileStringTemplate: 'echo "{0} {1}"',
            fileType: '.*',
            testBulkOperation: true,
        }
        
        var result = getMatchingFilesUnderPath(testPath, options);
        
        result.should.containEql('echo "dir1.csproj dir1.csproj"');
    });

    it('does not execute commands when testBulkOperation is set to true', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);
        
        var options = {
            fileStringTemplate: 'echo "{0} {1}"',
            fileType: '.*',
            runBulkOperation: true,
            testBulkOperation: true,
        }
        
        var result = getMatchingFilesUnderPath(testPath, options);
        
        result.should.containEql('echo "dir1.csproj dir1.csproj"');
    });

    it('adds the file match output a maximum of three times to the fileStringTemplate', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);
        
        var options = {
            fileStringTemplate: 'echo "{0},{1},{2},{3},{4}"',
            fileType: '.*',
            runBulkOperation: true,
            testBulkOperation: true,
        }
        
        var result = getMatchingFilesUnderPath(testPath, options);
        
        result.should.containEql('echo "dir1.csproj,dir1.csproj,dir1.csproj,,"');
    });

    it('logs errors from executing generated commands to an error file when runBulkOperation and writeOutputToFile are both true', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);
        
        var options = {
            errorFileName: 'theBestErrorFile.txt',
            fileType: '.csproj',
            fileStringTemplate: 'npm run derp {0}',
            outputFileName: 'customName.xml',
            runBulkOperation: true,
            writeOutputToFile: true,
        }
        
        getMatchingFilesUnderPath(testPath, options);
        var result = fs.readFileSync(options.errorFileName, { encoding: 'utf8' });

        should.exist(result);
        result.should.containEql('Error: Command failed: npm run derp');
        result.should.containEql('npm ERR!');
    });

    after(() => {
        fs.unlinkSync('customName.xml');
        fs.unlinkSync('theBestErrorFile.txt');
    });
});