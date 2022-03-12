const { app, BrowserWindow, ipcMain, protocol } = require("electron");
const loadState = require("./loadState");

const pictureExtensions = [".png", ".jpg", ".jpeg"];

ipcMain.on("set-title", (event, title) => {
	const webContents = event.sender;
	const win = BrowserWindow.fromWebContents(webContents);
	win.setTitle(title);
});

ipcMain.handle("getAllTags", () => loadState.getAllTags());
ipcMain.handle("getAllEntities", () => loadState.getAllEntities());

app.whenReady().then(() => {
	protocol.registerFileProtocol("resource", (req, callback) => {
		if (pictureExtensions.some((extension) => req.url.endsWith(extension))) {
			callback(req.url.substring(11));
			return;
		}
		callback(req.url);
	});
});
