const { app, BrowserWindow, ipcMain, dialog, protocol } = require("electron");
const loadState = require("./loadState");

const pictureExtensions = [".png", ".jpg", ".jpeg", ".webp"];

ipcMain.on("setTitle", (event, title) => {
	const webContents = event.sender;
	const win = BrowserWindow.fromWebContents(webContents);
	win.setTitle(title);
});

ipcMain.handle("getAllTags", () => loadState.getAllTags());
ipcMain.handle("getAllEntities", () => loadState.getAllEntities());
ipcMain.handle("getEntity", (event, id) => loadState.getEntity(id));
ipcMain.handle("dialog:openDirectory", async (event) => {
	const webContents = event.sender;
	const win = BrowserWindow.fromWebContents(webContents);
	const { canceled, filePaths } = await dialog.showOpenDialog(win, {
		properties: ["openDirectory"]
	});
	if (canceled) {
		return null;
	}
	return filePaths[0];
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
