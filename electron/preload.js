const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
	setTitle: (title) => ipcRenderer.send("setTitle", title),
	getAllTags: () => ipcRenderer.invoke("getAllTags"),
	getAllEntities: () => ipcRenderer.invoke("getAllEntities"),
	getEntity: (id) => ipcRenderer.invoke("getEntity", id)
});
