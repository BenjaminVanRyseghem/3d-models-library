const { app, BrowserWindow, ipcMain, dialog, protocol, shell } = require("electron");
const loadState = require("./loadState");
const { readdir, readFile } = require("fs/promises");
const path = require("path");

const modelExtensions = [".stl", ".lys", ".ctb", ".obj"];
const archiveExtensions = [".zip", ".7z", ".tar.gz"];
const pictureExtensions = [".png", ".jpg", ".jpeg", ".webp"];

async function getInfo(dir) {
	let dirents = await readdir(dir, { withFileTypes: true });
	let pictures = [];
	let models = [];
	let archives = [];
	let alreadyImported = false;

	dirents.forEach((dirent) => {
		if (dirent.isFile()) {
			let ext = path.extname(dirent.name).toLowerCase();

			if (dirent.name === ".3d-model-entity.json") {
				alreadyImported = true;
			}

			if (modelExtensions.indexOf(ext) !== -1) {
				models.push(dirent);
			}

			if (pictureExtensions.indexOf(ext) !== -1) {
				pictures.push(path.resolve(dir, dirent.name));
			}

			if (archiveExtensions.indexOf(ext) !== -1) {
				archives.push(dirent);
			}
		}
	});

	return {
		pictures,
		models,
		archives,
		alreadyImported
	};
}

ipcMain.on("setTitle", (event, title) => {
	const webContents = event.sender;
	const win = BrowserWindow.fromWebContents(webContents);
	win.setTitle(title);
});

ipcMain.handle("getAllTags", () => loadState.getAllTags());
ipcMain.handle("getAllAvailableTags", () => loadState.getAllTags().then((tagsMap) => {
	let tags = Object.keys(tagsMap);
	tags.sort();
	return tags;
}));
ipcMain.handle("getAllAvailableKinds", () => loadState.getAllKinds().then((kindsMap) => {
	let kinds = Object.keys(kindsMap);
	kinds.sort();
	return kinds;
}));
ipcMain.handle("getAllEntities", (event, filters) => loadState.searchEntities(filters));
ipcMain.handle("getEntity", (event, id) => loadState.getEntity(id));
ipcMain.handle("writeEntityFile", async (event, { answers, folderPath, pictures }) => {
	let [{ writeEntityFile }, { getData, resolveParenthood }, { compress }] = await Promise.all([
		import("../cli/importFolder.js"),
		import("../cli/database.js"),
		import("../cli/compress.js")
	]);

	if (answers.createArchive) {
		await compress({
			folder: folderPath,
			name: answers.name,
			deleteFiles: true
		});
	}

	await writeEntityFile({
		answers,
		folderPath,
		pictures: pictures.map(({ name }) => ({ name: path.relative(folderPath, name) }))
	});

	let { entities: [entity] } = await getData(folderPath);

	resolveParenthood({
		folderPath,
		entity
	});

	return entity;
});
ipcMain.handle("selectFolder", async (event) => {
	const webContents = event.sender;
	const win = BrowserWindow.fromWebContents(webContents);
	const { canceled, filePaths } = await dialog.showOpenDialog(win, {
		properties: ["openDirectory"]
	});
	if (canceled) {
		return null;
	}

	let [folderPath] = filePaths;
	let info = await getInfo(folderPath);

	return {
		folderPath,
		...info
	};
});

ipcMain.handle("getStlContent", (event, filePath) => readFile(filePath));
ipcMain.handle("reloadEntitiesDB", () => loadState.init());
ipcMain.handle("editConfigFile", (event, folderPath) => shell.openPath(path.resolve(folderPath, ".3d-model-entity.json")));

app.whenReady().then(() => {
	protocol.registerFileProtocol("resource", (req, callback) => {
		if (pictureExtensions.some((extension) => req.url.endsWith(extension))) {
			callback(req.url.substring(11));
			return;
		}
		callback(req.url);
	});
});
