// eslint-disable-next-line filenames/match-regex
require("./electron/ipc.js");
const electron = require("electron");
const path = require("path");
const url = require("url");
const loadState = require("./electron/loadState");

const { app } = electron;

// Module to create native browser window.
const { BrowserWindow } = electron;

loadState.init();

/*
 * Keep a global reference of the window object, if you don't, the window will
 * be closed automatically when the JavaScript object is garbage collected.
 */
let mainWindow = null;

function createWindow() {
	// Create the browser window.
	mainWindow = new BrowserWindow({
		width: 1100,
		minWidth: 1100,
		height: 850,
		minHeight: 850,
		webPreferences: {
			nodeIntegration: true,
			preload: path.join(__dirname, "electron", "preload.js")
		}
	});

	mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
		callback({
			responseHeaders: {
				...details.responseHeaders,
				"Content-Security-Policy": [
					"default-src 'self' resource: ; style-src 'self' 'unsafe-inline'; connect-src 'self' blob:; img-src 'self' blob: resource:"
				]
			}
		});
	});

	// eslint-disable-next-line no-process-env
	const startUrl = process.env.ELECTRON_START_URL || url.format({
		pathname: path.join(__dirname, "build/index.html"),
		protocol: "file:",
		slashes: true
	});
	mainWindow.loadURL(startUrl);

	// eslint-disable-next-line no-process-env
	if (process.env.ELECTRON_START_URL) {
		// Open the DevTools.
		mainWindow.webContents.openDevTools();
	}

	// Emitted when the window is closed.
	mainWindow.on("closed", () => {
		/*
		 * Dereference the window object, usually you would store windows
		 * in an array if your app supports multi windows, this is the time
		 * when you should delete the corresponding element.
		 */
		mainWindow = null;
	});
}

/*
 * This method will be called when Electron has finished
 * initialization and is ready to create browser windows.
 * Some APIs can only be used after this event occurs.
 */
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
	/*
	 * On OS X it is common for applications and their menu bar
	 * to stay active until the user quits explicitly with Cmd + Q
	 */
	if (process.platform !== "darwin") {
		app.quit();
	}
});

app.on("activate", () => {
	/*
	 * On OS X it's common to re-create a window in the app when the
	 * dock icon is clicked and there are no other windows open.
	 */
	if (mainWindow === null) {
		createWindow();
	}
});

/*
 * In this file you can include the rest of your app's specific main process
 * code. You can also put them in separate files and require them here.
 */
