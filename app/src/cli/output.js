const { mkdir, readFile, writeFile } = require("fs/promises");
const mime = require("mime-types");
const path = require("path");

module.exports = function output({ human: humanReadable, export: exportOutput }) {
	if (exportOutput) {
		return buildExportOutput(exportOutput);
	}

	return buildLogOutput(humanReadable);
}

function buildExportOutput(fileName) {
	return async (entities) => {
		await Promise.all(entities.map((entity) => traverse(entity)));
		let name = fileName === true ? "export" : fileName;
		if (!path.extname(name)) {
			name += ".json";
		}
		let file = path.resolve("./", `${name}`);
		await mkdir(path.dirname(file), { recursive: true });
		return writeFile(file, JSON.stringify(entities, null, 2));
	};
}

function buildLogOutput(humanReadable) {
	if (humanReadable) {
		// eslint-disable-next-line no-console
		return (entities) => { console.log(JSON.stringify(entities, null, 2)); };
	}
	// eslint-disable-next-line no-console
	return (entities) => { console.log(JSON.stringify(entities,)); };
}

async function traverse(entity) {
	if (entity.cover) {
		entity.cover = await encodeImage(entity.path, entity.cover);
	}
	if (entity.pictures) {
		entity.pictures = await Promise.all(entity.pictures.map((picture) => encodeImage(entity.path, picture)));
	}

	delete entity.path;
	entity.exported = true;

	return Promise.all(entity.children.map((child) => traverse(child)));
}

async function encodeImage(folder, file) {
	let content = await readFile(path.resolve(folder, file), "base64");
	let type = mime.lookup(file);
	return `data:${type};base64,${content}`;
}
