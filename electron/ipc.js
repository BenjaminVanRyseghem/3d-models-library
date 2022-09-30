const { app, BrowserWindow, ipcMain, dialog, protocol } = require("electron");
const loadState = require("./loadState");
const { readdir } = require("fs/promises");
const path = require("path");

const modelExtensions = [".stl", ".lys", ".ctb", ".obj"];
const archiveExtensions = [".zip", ".7z", ".tar.gz"];

const pictureExtensions = [".png", ".jpg", ".jpeg", ".webp"];

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
		archives
	};
}

ipcMain.on("setTitle", (event, title) => {
	const webContents = event.sender;
	const win = BrowserWindow.fromWebContents(webContents);
	win.setTitle(title);
});

ipcMain.handle("getAllTags", () => loadState.getAllTags());
ipcMain.handle("getAllEntities", () => loadState.getAllEntities());
ipcMain.handle("getEntity", (event, id) => loadState.getEntity(id));
ipcMain.handle("writeEntityFile", async (event, { answers, folderPath, pictures }) => {
	let [{ writeEntityFile }, { getData, resolveParenthood }] = await Promise.all([
		import("../cli/importFolder.js"),
		import("../cli/database.js")
	]);

	await writeEntityFile({
		answers: {
			...answers,
			cover: path.relative(folderPath, answers.cover)
		},
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
ipcMain.handle("dialog:openDirectory", async (event) => {
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

app.whenReady().then(() => {
	protocol.registerFileProtocol("resource", (req, callback) => {
		if (pictureExtensions.some((extension) => req.url.endsWith(extension))) {
			callback(req.url.substring(11));
			return;
		}
		callback(req.url);
	});
});
