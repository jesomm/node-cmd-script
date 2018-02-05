var should = require('should');
const executeCommand = require('../executeCommand');
const { newline, getMatchingFilesUnderPath } = require('../getXml');

describe('getAllCsprojUnderPath()', () => {
    it('returns null when there are no csproj in the calling path or any subfolder below it', () => {
        var path = executeCommand('cd').split(newline)[0];
        path = `${path}\\test\\dir\\dir3\\d3.1`;

        var options = {
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(path, options);

        result.should.be.null;
        result.should.not.containEql('IGNORE_ME_ASSET.png');
    });

    it('returns a matching file', () => {
        var path = executeCommand('cd').split(newline)[0];
        path = `${path}\\test\\dir\\dir1`;

        var options = {
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(path, options);

        result.should.containEql('dir1.csproj');
    });

    it('ignores non-matching files', () => {
        var path = executeCommand('cd').split(newline)[0];
        path = `${path}\\test\\dir\\dir2`;

        var options = {
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(path, options);
    
        result.should.not.containEql('IGNORE_ME');
        result[0].should.containEql('.csproj');
    });

    it('ignores banned directories', () => {
        var path = executeCommand('cd').split(newline)[0];
        path = `${path}\\test\\dir`;

        var options = {
            ignoreDirs: ['ignoreMe'],
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(path, options);
    
        result.should.not.containEql('IGNORE_ME.csproj');
        result.should.containEql('dir3.2.2.csproj');
    });

    it('stops searching recursively in a file path once it finds the least-deep csproj', () => {
        var path = executeCommand('cd').split(newline)[0];
        path = `${path}\\test\\dir\\dir3`;
        
        var options = {
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(path, options);

        result.should.not.containEql('dir3.2.1.1_IGNORED.csproj');
        result.should.containEql('dir3.2.1.csproj');
    });
    
    it('returns only filenames when requested', () => {
        var path = executeCommand('cd').split(newline)[0];
        path = `${path}\\test\\dir`;
        
        var options = {
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
            fileType: '.csproj',
        }

        var result = getMatchingFilesUnderPath(path, options)[0];

        result.should.containEql(options.fileType);
        result.should.containEql(path);
    });
});