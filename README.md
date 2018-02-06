## node-cmd-script

As part of integrating two different source depot branches, I needed to generate some XML and run a huge number of sd commands. While I could have done this with [batch scripting](https://www.tutorialspoint.com/batch_script/index.htm), I thought it would be interesting to use Node instead.

Posting this to GitHub on the off chance somebody else wants to do the same thing?

> NOTE: This is all very windows-y but could be made less environment-specific if needed.

- - -

This code currently exports one main function: `getMatchingFilesUnderPath`. It searches recursively for matching files and returns as soon as it finds one. An intentional side effect of this implementation is that it stops searching subfolders on finding a match in a parent folder. It will continue searching sibling folders until it finds or conclusively does not find additional matching files.

If no matching files are found, this function returns `null`.
If one matching file is found, this function returns the file path as a string.
For all other matches, it returns an array of strings.

You can specify additional options including directories to ignore and additional content to append to the file output string:

option                   | explanation
-------------------------|------------
fileType                 | the file type to look for, eg `.csproj`
ignoreDirs               | directories not to search in; probably similar to the contents of a `.gitignore` or `.npmignore`
beforeFileString         | anything you want returned with the file string, eg, `<mock xml="` for `<mock xml="fileName.csproj" />`
afterFileString          | anything you want returned with the file string, eg, `" />` for `<mock xml="fileName.csproj" />`
shouldReturnFullPath     | set to true if you want to return the full path, eg `D:/Git/YourRepo/Package/Project.csproj` instead of `Project.csproj`
shouldReturnRelativePath | set to true if you want to return a relative to where you're calling, eg `Package/Project.csproj` when called from `D:/Git/YourRepo/`
writeOutputToFile        | set to true if you want to write output to file or false if you want to handle output yourself
outputFileName           | set to override default `output.txt` when `writeOutputToFile` is true


### Developing with this repository

While it's still windows-flavored, you must work from a windows command shell.
1. `git pull` to get the latest changes
2. `yarn` to grab build dependencies
3. `npm run test` to run tests