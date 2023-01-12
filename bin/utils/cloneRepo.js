const spawn = require("cross-spawn");
const path = require("path");

const tryGitClone = (url, projectName) => {
	const clone = spawn.sync("git", ["clone", url, projectName], {
		stdio: "inherit",
	});

	return clone;
};

module.exports = (projectName) => {
	const http = "https://github.com/0xATHERIS/create-react-interface.git";
	const ssh = "git@github.com:0xATHERIS/create-react-interface.git";
	const root = path.resolve(projectName);

	console.log();
	console.log(`Creating a new React UI Library in ${chalk.green(root)}.`);
	console.log();

	const cloneHttp = tryGitClone(http, projectName);
	if (cloneHttp.status === 0) {
		return true;
	}

	// If we couldn't managed to clone repository via https, try with ssh
	const cloneSsh = tryGitClone(ssh, projectName);
	return cloneSsh.status === 0;
};
