# node-cmd-script

As part of integrating two different source depot branches, I needed to generate some XML and run a huge number of sd commands. While I could have done this with [batch scripting](https://www.tutorialspoint.com/batch_script/index.htm), I thought it would be interesting to use Node instead.

Posting this to GitHub on the off chance somebody else wants to do the same thing?

> NOTE: This is all very windows-y but could be made less environment-specific if needed.

- - -

This code currently exports one main function: `getMatchingFilesUnderPath`. By default, it searches recursively for matching files and returns as soon as it finds one. An intentional side effect of this implementation is that it stops searching subfolders on finding a match in a parent folder. It will continue searching sibling folders until it finds or conclusively does not find additional matching files. If you do not specify a file type to match, it will return the first file found.

If no matching files are found, this function returns `null`.
If one matching file is found, this function returns the file path as a string.
For all other matches, it returns an array of strings.

You can specify additional options:

option                   | explanation
-------------------------|------------
stopOnFirstMatch         | set to false to override default search behavior and return all matches. _this is way, way less performant_, as it will search every single directory under your original calling path.
fileType                 | the file type to look for, eg `.csproj`
ignoreDirs               | directories not to search in; probably similar to the contents of a `.gitignore` or `.npmignore`
fileStringTemplate       | anything you want returned with the file string, eg, `<mock xml="{0}" />` for `<mock xml="fileName.csproj" />`
shouldReturnFullPath     | set to true if you want to return the full path, eg `D:/Git/YourRepo/Package/Project.csproj` instead of `Project.csproj`
shouldReturnRelativePath | set to true if you want to return a relative to where you're calling, eg `Package/Project.csproj` when called from `D:/Git/YourRepo/`
relativePathTo           | override the default behavior of returning relative path to path called from; must be a substring of original calling path, eg `D:/Git`
writeOutputToFile        | set to true if you want to write output to file or false if you want to handle output yourself
outputFileName           | set to override default `output.txt` when `writeOutputToFile` is true
runBulkOperation         | set to true if you want to use `fileStringTemplate` to construct a command you want to run against every file
testBulkOperation        | set to true if you need to insert relative paths twice in the string, eg for sd integrate commands
errorFileName            | set to override default `error.txt` when `runBulkOperation` and `writeOutputToFile` are true
stopOnError              | set to true if you want bulk operation to stop on error; otherwise it will simply log the error and continue
mirrorDirectoryStructure | set to true if you want to run a command that requires mirroring the directory structure, eg copying from one location to another
mirrorDirectoriesWhere   | the location to start mirroring from :)

- - -

## Developing with this repository

While it's still windows-flavored, you must work from a windows command shell.
1. `git pull` to get the latest changes
2. `yarn` to grab build dependencies
3. `npm run test` to run tests