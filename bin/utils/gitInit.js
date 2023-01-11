const spawn = require("cross-spawn");
const rimraf = require("rimraf");

/**
 * Tries to initialize git repository in freshly created app
 */
module.exports = (projectName) => {
	let didInit = false;

	try {
		spawn.sync("git --version", { stdio: "ignore" });
		spawn.sync("git init", { cwd: projectName, stdio: "ignore" });
		didInit = true;

		spawn.sync("git add -A", { cwd: projectName, stdio: "ignore" });
		spawn.sync(
			'git commit -m "Initial commit from Create Social Network"',
			{
				cwd: projectName,
				stdio: "ignore",
			}
		);
	} catch (error) {
		if (didInit) {
			// If we successfully initialized but couldn't commit, maybe the commit author config is not set.
			try {
				rimraf.sync(`${projectName}/.git`);
			} catch (removeErr) {
				// Ignore.
			}
		}
		return false;
	}
};
