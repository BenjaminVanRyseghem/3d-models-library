import { Command } from "commander";
import importFolder from "./importFolder.js";
import migrate from "./migrate.js";
import search from "./search.js";

function wrapCommand(command) {
	return async (...args) => {
		try {
			await command(...args);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error(error.message);
			// eslint-disable-next-line no-process-exit
			process.exit(1);
		}
	};
}

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
	.option("-x, --export [string]", "export the output as JSON", "")
	.action(wrapCommand(search));
program.command("import")
	.description("command to import a folder in the database")
	.argument("<folder>", "folder to import")
	.action(wrapCommand(importFolder));

program.command("migrate")
	.description("command to force the migration of the database entry to the latest version")
	.option("-r, --root <string>", "root directory of your on-disk library", process.cwd())
	.action(wrapCommand(migrate));

program.parse();
