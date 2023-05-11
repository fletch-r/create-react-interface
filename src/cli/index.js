#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var fse = require("fs-extra");
var path = require("path");
var inquirer = require('inquirer');
var runCommand = function (command) {
    try {
        (0, child_process_1.execSync)("".concat(command), { stdio: 'inherit' });
    }
    catch (error) {
        console.error("Failed to execute command: ".concat(command), error);
        return false;
    }
    return true;
};
function tailwind(repoName) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer
                        .prompt([
                        {
                            name: 'tailwind',
                            message: 'Do you want to install tailwindcss?',
                            type: 'confirm'
                        },
                    ])
                        .then(function (answers) { return __awaiter(_this, void 0, void 0, function () {
                        var install, installRes, tailwindInit, tailwindInitRes, tailwindconfig, storybookStylingAddon, storybookStylingAddonRes, maints, tailwindcss, previewts, indexts;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    if (!answers.tailwind) return [3 /*break*/, 1];
                                    install = "cd ".concat(repoName, " && npm install -D tailwindcss postcss autoprefixer");
                                    installRes = runCommand(install);
                                    if (!installRes) {
                                        console.error("Failed to install [tailwindcss postcss autoprefixer] for the repository with name: ".concat(repoName));
                                        process.exit(1);
                                    }
                                    tailwindInit = "cd ".concat(repoName, " && npx tailwindcss init -p");
                                    tailwindInitRes = runCommand(tailwindInit);
                                    if (!tailwindInitRes) {
                                        console.error("Failed to initialize tailwindcss for the repository with name: ".concat(repoName));
                                        process.exit(1);
                                    }
                                    if (!fse.existsSync("./".concat(repoName, "/tailwind.config.js"))) {
                                        console.error('npx tailwind init failed to initialize,');
                                        process.exit(1);
                                    }
                                    tailwindconfig = "/** @type {import('tailwindcss').Config} */\nmodule.exports = {\n    content: [\"./src/**/*.{js,ts,jsx,tsx}\"],\n    theme: {\n        extend: {},\n    },\n    plugins: [],\n}";
                                    fse.writeFileSync("./".concat(repoName, "/tailwind.config.js"), tailwindconfig, { encoding: 'utf8', flag: 'w' });
                                    storybookStylingAddon = "cd ".concat(repoName, " && npm i -D @storybook/addon-styling");
                                    storybookStylingAddonRes = runCommand(storybookStylingAddon);
                                    if (!storybookStylingAddonRes) {
                                        console.error('Failed to install @storybook/addon-styling.');
                                        process.exit(1);
                                    }
                                    maints = "import type { StorybookConfig } from \"@storybook/react-webpack5\";\n\nconst config: StorybookConfig = {\n    stories: [\"../src/**/*.mdx\", \"../src/**/*.stories.@(js|jsx|ts|tsx)\"],\n    addons: [\n        \"@storybook/addon-links\",\n        \"@storybook/addon-essentials\",\n        \"@storybook/addon-interactions\",\n        {\n            name: '@storybook/addon-styling',\n            options: {\n                // Check out https://github.com/storybookjs/addon-styling/blob/main/docs/api.md\n                // For more details on this addon's options.\n                postCss: true,\n            },\n        },\n    ],\n    framework: {\n        name: \"@storybook/react-webpack5\",\n        options: {},\n    },\n    docs: {\n        autodocs: \"tag\",\n    },\n};\n\nexport default config;";
                                    fse.writeFileSync("./".concat(repoName, "/.storybook/main.ts"), maints, { encoding: 'utf8', flag: 'w' });
                                    tailwindcss = "@tailwind base;\n@tailwind components;\n@tailwind utilities;";
                                    fse.writeFileSync("./".concat(repoName, "/src/tailwind.css"), tailwindcss, { encoding: 'utf8', flag: 'w' });
                                    previewts = "import '../src/tailwind.css';\nimport type { Preview } from \"@storybook/react\";\n\nconst preview: Preview = {\n    parameters: {\n        actions: { argTypesRegex: \"^on[A-Z].*\" },\n        controls: {\n            matchers: {\n                color: /(background|color)$/i,\n                date: /Date$/,\n            },\n        },\n    },\n};\n\nexport default preview;";
                                    fse.writeFileSync("./".concat(repoName, "/.storybook/preview.ts"), previewts, { encoding: 'utf8', flag: 'w' });
                                    indexts = "import '../src/tailwind.css';\n\nexport * from \"./components\";";
                                    fse.writeFileSync("./".concat(repoName, "/src/index.ts"), indexts, { encoding: 'utf8', flag: 'w' });
                                    console.log('Finished installing tailwindcss');
                                    return [3 /*break*/, 3];
                                case 1: return [4 /*yield*/, npmInstall(repoName)];
                                case 2:
                                    _a.sent();
                                    _a.label = 3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function npmInstall(repoName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, inquirer
                        .prompt([
                        {
                            name: 'npmInstall',
                            message: 'Do you want to run npm install now?',
                            type: 'confirm'
                        },
                    ])
                        .then(function (answers) {
                        if (answers.npmInstall) {
                            var installDepsCommand = "cd ".concat(repoName, " && npm install");
                            console.log("Installing dependencies for the repository with name: ".concat(repoName));
                            var installedDeps = runCommand(installDepsCommand);
                            if (!installedDeps) {
                                console.error("Failed to install dependencies for the repository with name: ".concat(repoName));
                                process.exit(1);
                            }
                        }
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var repoName, answers, git_commands, checkedOut, srcDir, tmpProjectDir, projectDir;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    repoName = process.argv[2];
                    if (!!repoName) return [3 /*break*/, 2];
                    return [4 /*yield*/, inquirer
                            .prompt([
                            {
                                name: 'projectName',
                                message: 'What is the name of the library?'
                            },
                        ])];
                case 1:
                    answers = _a.sent();
                    repoName = answers.projectName;
                    _a.label = 2;
                case 2:
                    git_commands = "git clone --depth 1 https://github.com/0xATHERIS/create-react-interface.git ".concat(repoName);
                    console.log("Creating the repository with name: ".concat(repoName));
                    return [4 /*yield*/, runCommand(git_commands)];
                case 3:
                    checkedOut = _a.sent();
                    if (!checkedOut) {
                        console.error("Failed to create the repository with name: ".concat(repoName));
                        process.exit(1);
                    }
                    srcDir = path.join("./".concat(repoName), "template");
                    tmpProjectDir = path.join('./', "".concat(repoName, "_tmp"));
                    fse.mkdirSync(tmpProjectDir);
                    fse.copySync(srcDir, tmpProjectDir, { overwrite: true });
                    projectDir = path.join('./', repoName);
                    fse.emptyDirSync(projectDir);
                    fse.copySync(tmpProjectDir, projectDir, { overwrite: true });
                    fse.rmSync(tmpProjectDir, { recursive: true, force: true });
                    fse.writeFile("./".concat(repoName, "/README.md"), "# ".concat(repoName), function (err) {
                        if (err)
                            throw err;
                    });
                    return [4 /*yield*/, tailwind(repoName)];
                case 4:
                    _a.sent();
                    console.log("Successfully created and installed the repository with name: ".concat(repoName));
                    console.log("Run the following commands to get started:");
                    console.log("cd ".concat(repoName));
                    console.log("npm run storybook");
                    return [2 /*return*/];
            }
        });
    });
}
main();
