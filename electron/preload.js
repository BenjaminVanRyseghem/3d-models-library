const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	getAllAvailableTags: () => ipcRenderer.invoke("getAllAvailableTags"),
	getAllEntities: () => ipcRenderer.invoke("getAllEntities"),
	getAllTags: () => ipcRenderer.invoke("getAllTags"),
	getEntity: (id) => ipcRenderer.invoke("getEntity", id),
	getStlContent: (...args) => ipcRenderer.invoke("getStlContent", ...args),
	reloadEntitiesDB: (...args) => ipcRenderer.invoke("reloadEntitiesDB", ...args),
	selectFolder: () => ipcRenderer.invoke("selectFolder"),
	setTitle: (title) => ipcRenderer.send("setTitle", title),
	writeEntityFile: (...args) => ipcRenderer.invoke("writeEntityFile", ...args)
});
