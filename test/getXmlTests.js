var should = require('should');
const executeCommand = require('../executeCommand');
const { newline, getMatchingFilesUnderPath } = require('../getXml');

describe('getAllCsprojUnderPath()', () => {
    // it('returns null when there are no csproj in the calling path or any subfolder below it', () => {
    //     true.should.containEql(false);
    // });

    // it('returns a matching file', () => {
    //     true.should.containEql(false);
    // });

    // it('ignores non-matching files', () => {
    //     true.should.containEql(false);
    // });

    it('ignores banned directories', () => {
        var path = executeCommand('cd').split(newline)[0];
        path = `${path}\\test\\dir`;

        var options = {
            ignoreDirs: ['ignoreMe', ''],
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(path, options);
    
        result.should.not.containEql('IGNORE_ME.csproj');
        result.should.containEql('dir3.2.2.csproj');
    });

    it('stops searching recursively in a file path once it finds the least-deep csproj', () => {
        var path = executeCommand('cd').split(newline)[0];
        path = `${path}\\test\\dir`;
        
        var options = {
            ignoreDirs: ['ignoreMe', ''],
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(path, options);

        result.should.not.containEql('dir3.2.1.1_IGNORED.csproj');
        result.should.containEql('dir3.2.1.csproj');
    });
    
    it('returns filenames when requested', () => {
        var path = executeCommand('cd').split(newline)[0];
        path = `${path}\\test\\dir`;
        
        var options = {
            ignoreDirs: ['ignoreMe', ''],
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(path, options)[0];

        result.should.containEql(options.fileType);
        result.should.not.containEql(path);
    });
    
    // it('returns paths comparative to starting path when requested', () => {
    //     true.should.containEql(false);
    // });

    it('returns full file paths when requested', () => {
        var path = executeCommand('cd').split(newline)[0];
        path = `${path}\\test\\dir`;
        
        var options = {
            shouldReturnPath: true,
            ignoreDirs: ['ignoreMe', ''],
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(path, options)[0];

        result.should.containEql(options.fileType);
        result.should.containEql(path);
    });
});