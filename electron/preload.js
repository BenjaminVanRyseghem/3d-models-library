const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	editConfigFile: (...args) => ipcRenderer.invoke("editConfigFile", ...args),
	getAllAvailableKinds: (...args) => ipcRenderer.invoke("getAllAvailableKinds", ...args),
	getAllAvailableTags: (...args) => ipcRenderer.invoke("getAllAvailableTags", ...args),
	getAllEntities: (...args) => ipcRenderer.invoke("getAllEntities", ...args),
	getAllTags: (...args) => ipcRenderer.invoke("getAllTags", ...args),
	getEntity: (...args) => ipcRenderer.invoke("getEntity", ...args),
	getStlContent: (...args) => ipcRenderer.invoke("getStlContent", ...args),
	reloadEntitiesDB: (...args) => ipcRenderer.invoke("reloadEntitiesDB", ...args),
	selectFolder: (...args) => ipcRenderer.invoke("selectFolder", ...args),
	setTitle: (...args) => ipcRenderer.send("setTitle", ...args),
	writeEntityFile: (...args) => ipcRenderer.invoke("writeEntityFile", ...args)
});
