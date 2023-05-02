#!/usr/bin/env node
var execSync = require('child_process').execSync;
var runCommand = function (command) {
    try {
        execSync("".concat(command), { stdio: 'inherit' });
    }
    catch (error) {
        console.error("Failed to execute command: ".concat(command), error);
        return false;
    }
    return true;
};
var repoName = process.argv[2];
if (!repoName) {
    console.error('No Name Provided');
    process.exit(1);
}
var gitCheckoutCommand = "git clone https://github.com/0xATHERIS/create-react-interface.git ".concat(repoName);
var installDepsCommand = "cd ".concat(repoName, " && npm install");
console.log("Cloning the repository with name: ".concat(repoName));
var checkedOut = runCommand(gitCheckoutCommand);
if (!checkedOut) {
    console.error("Failed to clone the repository with name: ".concat(repoName));
    process.exit(1);
}
console.log("Installing dependencies for the repository with name: ".concat(repoName));
var installedDeps = runCommand(installDepsCommand);
if (!installedDeps) {
    console.error("Failed to install dependencies for the repository with name: ".concat(repoName));
    process.exit(1);
}
console.log("Successfully cloned and installed the repository with name: ".concat(repoName));
console.log("Run the following commands to get started:");
console.log("cd ".concat(repoName));
console.log("npm start");
