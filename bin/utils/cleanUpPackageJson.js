const fs = require("fs-extra");

module.exports = (filePath, name) => {
	const jsonString = fs.readFileSync(filePath);
	const packageJson = JSON.parse(jsonString);

	// Rename package
	packageJson.name = name;
	packageJson.version = "0.1.0"; // Default package.json version number

	// Delete my details
	delete packageJson.publishConfig;

	// Blank out my details
	packageJson.repository.url = "";
	packageJson.bugs.url = "";
	packageJson.author = "";
	packageJson.homepage = "";

	// Delete deps only used for cli
	delete packageJson.dependencies["chalk"];
	delete packageJson.dependencies["commander"];
	delete packageJson.dependencies["cross-spawn"];
	delete packageJson.dependencies["fs-extra"];
	delete packageJson.dependencies["prompts"];
	delete packageJson.dependencies["semver"];
	delete packageJson.dependencies["validate-npm-package-name"];

	// Write file
	const packageJsonFileString = JSON.stringify(packageJson, null, 2);
	fs.writeFileSync(filePath, packageJsonFileString);
};
