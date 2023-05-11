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

async function tailwind(repoName: string) {
    await inquirer
        .prompt([
            {
                name: 'tailwind',
                message: 'Do you want to install tailwindcss?',
                type: 'confirm'
            },
        ])
        .then(async (answers: { tailwind: string; }) => {
            if (answers.tailwind) {
                const install = `cd ${repoName} && npm install -D tailwindcss postcss autoprefixer`;
                const installRes = runCommand(install);
                if (!installRes) {
                    console.error(`Failed to install [tailwindcss postcss autoprefixer] for the repository with name: ${repoName}`);
                    process.exit(1);
                }
                const tailwindInit = `cd ${repoName} && npx tailwindcss init -p`;
                const tailwindInitRes = runCommand(tailwindInit);
                if (!tailwindInitRes) {
                    console.error(`Failed to initialize tailwindcss for the repository with name: ${repoName}`);
                    process.exit(1);
                }
                if (!fse.existsSync(`./${repoName}/tailwind.config.js`)) {
                    console.error('npx tailwind init failed to initialize,');
                    process.exit(1);
                }
                const tailwindconfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [],
}`;
                fse.writeFileSync(`./${repoName}/tailwind.config.js`, tailwindconfig, { encoding: 'utf8', flag: 'w' });
                const storybookStylingAddon = `cd ${repoName} && npm i -D @storybook/addon-styling`;
                const storybookStylingAddonRes = runCommand(storybookStylingAddon);
                if (!storybookStylingAddonRes) {
                    console.error('Failed to install @storybook/addon-styling.');
                    process.exit(1);
                }

                const maints = `import type { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
    stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
    addons: [
        "@storybook/addon-links",
        "@storybook/addon-essentials",
        "@storybook/addon-interactions",
        {
            name: '@storybook/addon-styling',
            options: {
                // Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md
                // For more details on this addon's options.
                postCss: true,
            },
        },
    ],
    framework: {
        name: "@storybook/react-webpack5",
        options: {},
    },
    docs: {
        autodocs: "tag",
    },
};

export default config;`;
                fse.writeFileSync(`./${repoName}/.storybook/main.ts`, maints, { encoding: 'utf8', flag: 'w' });

                const tailwindcss = `@tailwind base;
@tailwind components;
@tailwind utilities;`;
                fse.writeFileSync(`./${repoName}/src/tailwind.css`, tailwindcss, { encoding: 'utf8', flag: 'w' });

                const previewts = `import '../src/tailwind.css';
import type { Preview } from "@storybook/react";

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/,
            },
        },
    },
};

export default preview;`;
                fse.writeFileSync(`./${repoName}/.storybook/preview.ts`, previewts, { encoding: 'utf8', flag: 'w' });

                const indexts = `import '../src/tailwind.css';

export * from "./components";`;
                fse.writeFileSync(`./${repoName}/src/index.ts`, indexts, { encoding: 'utf8', flag: 'w' });

                console.log('Finished installing tailwindcss');
            } else {
                await npmInstall(repoName);
            }
        });
}

async function npmInstall(repoName: string) {
    await inquirer
        .prompt([
            {
                name: 'npmInstall',
                message: 'Do you want to run npm install now?',
                type: 'confirm'
            },
        ])
        .then((answers: { npmInstall: string; }) => {
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
}

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

    fse.writeFile(`./${repoName}/README.md`, `# ${repoName}`, (err: Error) => {
        if (err) throw err;
    });

    await tailwind(repoName);
    
    console.log(`Successfully created and installed the repository with name: ${repoName}`);
    console.log(`Run the following commands to get started:`);
    console.log(`cd ${repoName}`);
    console.log(`npm run storybook`);
}

main();