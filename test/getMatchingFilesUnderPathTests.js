const should = require('should');
const fs = require('fs');
const path = require('path');
const executeCommand = require('../lib/executeCommand');
const { getMatchingFilesUnderPath } = require('../lib/getMatchingFilesUnderPath');
const { newline } = require('../lib/constants');

describe('getMatchingFilesUnderPath()-- behaviors not changed by stopOnFirstMatch flag', () => {
    var currentPath = executeCommand('cd').split(newline)[0];

    // to actually prove behaviors are not changed by the flag
    [true, undefined, false].forEach(flag => {
        describe(`stopOnFirstMatch: ${flag}`, () => {
            it('returns null when there are no matching files in the calling path or any subfolder below it', () => {
                testPath = path.normalize(`${currentPath}\\test\\dir\\dir3\\d3.1`);
        
                var options = {
                    fileType: '.csproj',
                    stopOnFirstMatch: flag,
                }
        
                var result = getMatchingFilesUnderPath(testPath, options);
        
                should.not.exist(result); // have to write weird, because null does not inherit should
            });

            it('ignores non-matching files', () => {
                testPath = path.normalize(`${currentPath}\\test\\dir\\dir2`);
        
                var options = {
                    fileType: '.csproj',
                    stopOnFirstMatch: flag,
                }
        
                var result = getMatchingFilesUnderPath(testPath, options);
            
                result.should.not.containEql('IGNORE_ME.md');
                result.should.containEql('dir2.1.csproj');
                result.length.should.equal(1);
            });

            it('does not add null to output when some directories do not contain matching files', () => {
                testPath = path.normalize(`${currentPath}\\test\\dir`);
        
                var options = {
                    ignoreDirs: ['ignoreMe'],
                    fileType: '.csproj',
                    stopOnFirstMatch: flag,
                }
        
                var result = getMatchingFilesUnderPath(testPath, options);
            
                result.should.not.containEql(null);
                result.should.not.containEql('null');
            });
        
            it('ignores banned directories', () => {
                testPath = path.normalize(`${currentPath}\\test\\dir`);
        
                var options = {
                    ignoreDirs: ['ignoreMe'],
                    fileType: '.csproj',
                    stopOnFirstMatch: flag,
                }
        
                var result = getMatchingFilesUnderPath(testPath, options);
            
                result.should.not.containEql('IGNORE_ME.csproj');
                result.should.containEql('dir3.2.2.csproj');
            });
            
            it('returns only filenames when requested', () => {
                testPath = path.normalize(`${currentPath}\\test\\dir`);
                
                var options = {
                    fileType: '.csproj',
                    stopOnFirstMatch: flag,
                }
        
                var result = getMatchingFilesUnderPath(testPath, options);
                var fileInResult = result[0];
        
                fileInResult.should.containEql(options.fileType);
                fileInResult.should.not.containEql(testPath);
            });
            
            it('returns relative paths to starting path when requested', () => {
                testPath = path.normalize(`${currentPath}\\test\\dir\\dir2`);
                
                var options = {
                    shouldReturnRelativePath: true,
                    fileType: '.csproj',
                    stopOnFirstMatch: flag,
                }
        
                var result = getMatchingFilesUnderPath(testPath, options);
                var fileInResult = result[0];
        
                fileInResult.should.equal('dir2.1\\dir2.1.csproj');
            });
        
            it('returns relative paths to subset of starting path when requested', () => {
                var testPath = path.normalize(`${currentPath}\\test\\dir\\dir2\\`);
                
                var options = {
                    shouldReturnRelativePath: true,
                    relativePathTo: `${path.normalize(currentPath)}\\`,
                    fileType: '.csproj',
                    stopOnFirstMatch: flag,
                }
        
                var result = getMatchingFilesUnderPath(testPath, options);
                var fileInResult = result[0];
        
                fileInResult.should.equal('test\\dir\\dir2\\dir2.1\\dir2.1.csproj');
            });
        
            it('throws on bad relative path', () => {
                var testPath = path.normalize(`${currentPath}\\test\\dir\\dir2\\`);
                var relativePath = `${path.normalize(currentPath)}\\`;
                var malformedPath = relativePath.slice(1);
                
                var options = {
                    shouldReturnRelativePath: true,
                    relativePathTo: malformedPath,
                    fileType: '.csproj',
                    stopOnFirstMatch: flag,
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
                    stopOnFirstMatch: flag,
                }
        
                var result = getMatchingFilesUnderPath(testPath, options)[0];
        
                result.should.containEql(options.fileType);
                result.should.containEql(testPath);
            });
            
            it('adds additional string content to file path when requested', () => {
                testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);
        
                var options = {
                    fileType: '.csproj',
                    fileStringTemplate: '<mock xml="{}" />',
                    stopOnFirstMatch: flag,
                }
        
                var result = getMatchingFilesUnderPath(testPath, options);
                var fileInResult = result[0];
        
                fileInResult.should.containEql('<mock xml="dir1.csproj" />');
            });
            
            it('does not add additional string content to file path when not requested', () => {
                testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);
        
                var options = {
                    fileType: '.csproj',
                    stopOnFirstMatch: flag,
                }
        
                var result = getMatchingFilesUnderPath(testPath, options);
                var fileInResult = result[0];
        
                fileInResult.should.equal('dir1.csproj');
            });
        
            it('writes to file when requested', () => {
                testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);
                
                var options = {
                    fileType: '.csproj',
                    writeOutputToFile: true,
                    outputFileName: 'customName.xml',
                    stopOnFirstMatch: flag,
                }
                /*
                    not testing default value in case user calls this function from root.
                    prefer not to destroy the output they wanted when cleaning up test output at end of this file. ;)
                */
                
                getMatchingFilesUnderPath(testPath, options);
                var result = fs.readFileSync(options.outputFileName, { encoding: 'utf8' });
        
                should.exist(result);
                result.should.equal(`dir1.csproj${newline}`);
                fs.unlinkSync('customName.xml');
            });
        
            it('takes in custom file name when writing to file', () => {
                testPath = path.normalize(`${currentPath}\\test\\dir\\dir1`);
                
                var options = {
                    fileType: '.csproj',
                    writeOutputToFile: true,
                    outputFileName: 'customName.xml',
                    stopOnFirstMatch: flag,
                }
                
                getMatchingFilesUnderPath(testPath, options);
                var result = fs.readFileSync(options.outputFileName, { encoding: 'utf8' });
        
                should.exist(result);
                result.should.equal(`dir1.csproj${newline}`);
                fs.unlinkSync('customName.xml');
            });
        });
    })
});