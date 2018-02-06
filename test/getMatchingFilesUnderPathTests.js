const should = require('should');
const fs = require('fs');
const path = require('path');
const executeCommand = require('../lib/executeCommand');
const { getMatchingFilesUnderPath } = require('../lib/getMatchingFilesUnderPath');
const { newline } = require('../lib/constants');

describe('getMatchingFilesUnderPath()', () => {
    var currentPath = executeCommand('cd').split(newline)[0];

    it('returns null when there are no csproj in the calling path or any subfolder below it', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir3\\d3.1`);

        var options = {
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(testPath, options);

        should.not.exist(result); // have to write weird, because null does not inherit should
    });

    it('returns a matching file', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);

        var options = {
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(testPath, options);

        result.should.containEql('dir1.csproj');
    });

    it('ignores non-matching files', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir2`);

        var options = {
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(testPath, options);
    
        result.should.not.containEql('IGNORE_ME.md');
        result.should.containEql('dir2.1.csproj');
    });

    it('ignores banned directories', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir`);

        var options = {
            ignoreDirs: ['ignoreMe'],
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(testPath, options);
    
        result.should.not.containEql('IGNORE_ME.csproj');
        result.should.containEql('dir3.2.2.csproj');
    });

    it('stops searching recursively in a file path once it finds the least-deep csproj', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir3`);
        
        var options = {
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(testPath, options);

        result.should.not.containEql('dir3.2.1.1_IGNORED.csproj');
        result.should.containEql('dir3.2.1.csproj');
    });
    
    it('returns only filenames when requested', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir`);
        
        var options = {
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(testPath, options)[0];

        result.should.containEql(options.fileType);
        result.should.not.containEql(testPath);
    });
    
    it('returns relative paths to starting path when requested', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir2`);
        
        var options = {
            shouldReturnRelativePath: true,
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(testPath, options);

        result.should.equal('dir2.1\\dir2.1.csproj');
    });

    it('returns relative paths to subset of starting path when requested', () => {
        var testPath = path.normalize(`${currentPath}\\test\\dir\\dir2\\`);
        
        var options = {
            shouldReturnRelativePath: true,
            relativePathTo: `${path.normalize(currentPath)}\\`,
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(testPath, options);

        result.should.equal('test\\dir\\dir2\\dir2.1\\dir2.1.csproj');
    });

    it('throws on bad relative path', () => {
        var testPath = path.normalize(`${currentPath}\\test\\dir\\dir2\\`);
        var relativePath = `${path.normalize(currentPath)}\\`;
        var malformedPath = relativePath.slice(1);
        
        var options = {
            shouldReturnRelativePath: true,
            relativePathTo: malformedPath,
            fileType: '.csproj',
        }

        var caughtException;
        try {
            getMatchingFilesUnderPath(testPath, options)
        } catch (e) {
            caughtException = e;
        }
        should.exist(caughtException);
    });

    it('returns full file paths when requested', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir`);
        
        var options = {
            shouldReturnFullPath: true,
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(testPath, options)[0];

        result.should.containEql(options.fileType);
        result.should.containEql(testPath);
    });
    
    it('adds additional string content to file path when requested', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);

        var options = {
            fileType: '.csproj',
            beforeFileString: '<mock xml="',
            afterFileString: '" />',
        }

        var result = getMatchingFilesUnderPath(testPath, options);

        result.should.containEql(options.beforeFileString);
        result.should.containEql(options.afterFileString);
    });
    
    it('does not add additional string content to file path when not requested', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);

        var options = {
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(testPath, options);

        result.should.equal('dir1.csproj');
    });

    it('writes to file when requested', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);
        
        var options = {
            fileType: '.csproj',
            writeOutputToFile: true,
            outputFileName: 'customName.xml'
        }
        /*
            not testing default value in case user calls this function from root.
            prefer not to destroy the output they wanted when cleaning up test output at end of this file. ;)
        */
        
        getMatchingFilesUnderPath(testPath, options);
        var result = fs.readFileSync(options.outputFileName, { encoding: 'utf8' });

        should.exist(result);
        result.should.equal('dir1.csproj');
    });

    it('takes in custom file name when writing to file', () => {
        testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);
        
        var options = {
            fileType: '.csproj',
            writeOutputToFile: true,
            outputFileName: 'customName.xml'
        }
        
        getMatchingFilesUnderPath(testPath, options);
        var result = fs.readFileSync(options.outputFileName, { encoding: 'utf8' });

        should.exist(result);
        result.should.equal('dir1.csproj');
    });

    // remove test output files
    after(() => {
        fs.unlinkSync('customName.xml');
    });
});