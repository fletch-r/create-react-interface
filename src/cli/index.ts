#!/usr/bin/env node

import { execSync } from "child_process";

const fse = require("fs-extra");
const path = require("path");
const inquirer = require('inquirer');

const runCommand = (command: string) => {
	try {
		execSync(`${command}`, { stdio: 'inherit' });
	} catch (error) {
		console.error(`Failed to execute command: ${command}`, error);
		return false;
	}
	return true;
};

async function main() {
    let repoName = process.argv[2];

    if (!repoName) {
        const answers = await inquirer
            .prompt([
                {
                    name: 'projectName',
                    message: 'What is the name of the library?'
                },
            ]);
        repoName = answers.projectName;
    }

    const git_commands = `git clone --depth 1 https://github.com/0xATHERIS/create-react-interface.git ${repoName}`;

    console.log(`Creating the repository with name: ${repoName}`);

    const checkedOut = await runCommand(git_commands);
    if (!checkedOut) {
        console.error(`Failed to create the repository with name: ${repoName}`);
        process.exit(1);
    }

    const srcDir = path.join(`./${repoName}`, "template");
    const tmpProjectDir = path.join('./', `${repoName}_tmp`);
    fse.mkdirSync(tmpProjectDir);
    fse.copySync(srcDir, tmpProjectDir, { overwrite: true });
    const projectDir = path.join('./', repoName);
    fse.emptyDirSync(projectDir);
    fse.copySync(tmpProjectDir, projectDir, { overwrite: true });
    fse.rmSync(tmpProjectDir, { recursive: true, force: true });

    await inquirer
        .prompt([
            {
                name: 'npmInstall',
                message: 'Do you want to run npm install now?',
                type: 'confirm'
            },
        ])
        .then((answers: { npmInstall: string }) => {
            if (answers.npmInstall) {
                const installDepsCommand = `cd ${repoName} && npm install`;
                console.log(`Installing dependencies for the repository with name: ${repoName}`);
                const installedDeps = runCommand(installDepsCommand);
                if (!installedDeps) {
                    console.error(`Failed to install dependencies for the repository with name: ${repoName}`);
                    process.exit(1);
                }
            }
        });
    
    console.log(`Successfully created and installed the repository with name: ${repoName}`);
    console.log(`Run the following commands to get started:`);
    console.log(`cd ${repoName}`);
    console.log(`npm run storybook`);
}

main();