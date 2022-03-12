const { readdir, writeFile } = require("fs").promises;
const path = require("path");
const inquirer = require("inquirer");

const modelExtensions = [".stl", ".lys", ".ctb", ".obj"];
const pictureExtensions = [".png", ".jpg", ".jpeg"];
const archiveExtensions = [".zip", ".7z", ".tar.gz"];

async function getInfo(dir) {
	let dirents = await readdir(dir, { withFileTypes: true });
	let pictures = [];
	let models = [];
	let archives = [];
	dirents.forEach((dirent) => {
		if (dirent.isFile()) {
			let ext = path.extname(dirent.name).toLowerCase();

			if (modelExtensions.indexOf(ext) !== -1) {
				models.push(dirent);
			}

			if (pictureExtensions.indexOf(ext) !== -1) {
				pictures.push(dirent);
			}

			if (archiveExtensions.indexOf(ext) !== -1) {
				archives.push(dirent);
			}
		}
	});

	return {
		pictures,
		models,
		archives
	};
}

function getLastItem(thePath) {
	let pathToSlice = thePath;
	if (pathToSlice.at(-1) === path.sep) {
		pathToSlice = pathToSlice.slice(0, -1);
	}
	return pathToSlice.substring(pathToSlice.lastIndexOf(path.sep) + 1);
}

let confirmImport = (folderPath) => ({
	message: `You are about to import "${folderPath}"`,
	name: "confirm-import",
	type: "confirm"
});

const noModels = (models) => ({
	message: "This folder has no model files. Are you sure?",
	name: "confirm-no-model",
	type: "confirm",
	default: false,
	when: (hash) => hash["confirm-import"] && !models.length
});

const noArchives = (archives) => ({
	message: "No archive detected. Do you want me to create one for you?",
	name: "createArchive",
	type: "confirm",
	when: (hash) => hash["confirm-import"] && hash["confirm-no-model"] !== false && !archives.length
});

const choosePicture = (pictures) => ({
	message: "Which picture to use as cover?",
	name: "picture",
	type: "list",
	choices: pictures.map((picture) => ({
		name: picture.name,
		value: picture.name
	})),
	when: (hash) => hash["confirm-import"] && hash["confirm-no-model"] !== false && pictures.length
});

const chooseName = (folder) => ({
	message: "What is the name of this entity?",
	name: "name",
	type: "input",
	default: folder,
	when: (hash) => hash["confirm-import"] && hash["confirm-no-model"] !== false
});

const chooseKind = {
	message: "What is the kind of this entity?",
	name: "kind",
	type: "list",
	choices: [
		{
			name: "Miniature",
			value: "miniature"
		},
		{
			name: "Bust",
			value: "bust"
		},
		{
			name: "Terrain",
			value: "terrain"
		},
		{
			name: "Props",
			value: "props"
		}
	],
	when: (hash) => hash["confirm-import"] && hash["confirm-no-model"] !== false
};

const chooseTags = {
	message: "What tags to attach to this entity? (comma separated)",
	name: "tags",
	type: "input",
	filter: (input) => input.split(","),
	when: (hash) => hash["confirm-import"] && hash["confirm-no-model"] !== false
};

const chooseTypes = {
	message: "What types of models are present?",
	name: "types",
	type: "checkbox",
	choices: [
		{
			name: "Unsupported",
			value: "unsupported"
		},
		{
			name: "Supported",
			value: "supported"
		},
		{
			name: "Lys file",
			value: "lys"
		}
	],
	when: (hash) => hash["confirm-import"] && hash["confirm-no-model"] !== false
};

async function importFolder(folder, opts) {
	let folderPath = path.resolve(process.cwd(), folder);
	let {
		models,
		pictures,
		archives
	} = await getInfo(folderPath);

	inquirer
		.prompt([
			confirmImport(folderPath),
			noModels(models),
			noArchives(archives),
			choosePicture(pictures),
			chooseName(getLastItem(folder)),
			chooseKind,
			chooseTags,
			chooseTypes
		])
		.then((answers) => {
			let data = {
				name: answers.name,
				kind: answers.kind,
				tags: answers.tags
			};

			if (answers.picture) {
				data.picture = `./${answers.picture}`;
			}
			if (answers.createArchive) {
				data.archive = `./${answers.name}.zip`;
			}

			let file = path.resolve(folderPath, ".3d-model-entity.json");
			return writeFile(file, JSON.stringify(data, null, 2));
		})
		.catch((error) => {
			if (error.isTtyError) {
				// Prompt couldn't be rendered in the current environment
			} else {
				// Something else went wrong
			}
		});
}

module.exports = importFolder;
