#!/usr/bin/env node

const { execSync } = require('child_process');

const runCommand = command => {
	try {
		execSync(`${command}`, { stdio: 'inherit' });
	} catch (error) {
		console.error(`Failed to execute command: ${command}`, error);
		return false;
	}
	return true;
};

const repoName = process.argv[2];

if (!repoName) {
    console.error('No Name Provided');
    process.exit(1);
}

const gitCheckoutCommand = `git clone https://github.com/0xATHERIS/create-react-interface.git ${repoName}`;
const installDepsCommand = `cd ${repoName} && npm install`;

console.log(`Cloning the repository with name: ${repoName}`);

const checkedOut = runCommand(gitCheckoutCommand);
if (!checkedOut) {
	console.error(`Failed to clone the repository with name: ${repoName}`);
	process.exit(1);
}

console.log(`Installing dependencies for the repository with name: ${repoName}`);
const installedDeps = runCommand(installDepsCommand);
if (!installedDeps) {
	console.error(`Failed to install dependencies for the repository with name: ${repoName}`);
	process.exit(1);
}

console.log(`Successfully cloned and installed the repository with name: ${repoName}`);
console.log(`Run the following commands to get started:`);
console.log(`cd ${repoName}`);
console.log(`npm start`);