const { Command } = require("commander");
const importFolder = require("./importFolder.js");
const search = require("./search.js");

let program = new Command();
program
	.name("3d-library")
	.description("CLI to browse and query your local on-disk 3d models library")
	.version("0.0.1");

program.command("search")
	.description("command to search for all entities, with possibly filters")
	.option("-r, --root <string>", "root directory of your on-disk library", process.cwd())
	.option("-h, --human", "make the output human readable")
	.option("-t, --tag <string...>", "filter by tag(s)")
	.option("-k, --kind <string...>", "filter by kind(s)")
	.option("-n, --name <string>", "filter by name (fuzzy)")
	.action(search);
program.command("import")
	.argument("<folder>", "folder to import")
	.action(importFolder);

program.parse();
