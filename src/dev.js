const { v4: uuidv4 } = require("uuid");

function findEntity(id, entities) {
	for (const entity of entities) {
		if (entity.id === id) {
			return entity;
		}

		let child = findEntity(id, entity.children);
		if (child) {
			return child;
		}
	}

	return null;
}

function appendId(entity) {
	entity.id = uuidv4();

	for (const child of entity.children) {
		appendId(child);
	}
}

// eslint-disable-next-line no-process-env
if (!window.electronAPI && process.env.NODE_ENV === "development") {
	let loadData = import("./dev.json")
		.then(({ default: entities }) => {
			for (const entity of entities) {
				appendId(entity);
			}

			return entities;
		});

	window.electronAPI = {
		setTitle: () => Promise.resolve(),
		getAllTags: () => Promise.resolve({}),
		getAllAvailableTags: () => Promise.resolve([]),
		getAllEntities: () => loadData,
		getEntity: (id) => loadData.then((data) => findEntity(id, data)),
		writeEntityFile({ answers, folderPath, pictures }) {
			// eslint-disable-next-line no-console
			console.dir({
				...answers,
				folderPath,
				pictures
			});
			return new Promise((resolve) => setTimeout(() => {
				resolve();
			}, 1000));
		},
		getStlContent: () => Promise.resolve(undefined),
		reloadEntitiesDB: () => Promise.resolve(undefined),
		selectFolder: () => new Promise((resolve) => {
			setTimeout(() => {
				resolve({
					folderPath: "/Users/foo/path to the/folder",
					pictures: [
						"/Users/benjamin/Documents/3d models/stl/Archvillain Games - 2022-08 - Agama - Shattered Valley/Archvillain Games - Agama - Shattered Valley - Presupported/Agama Aztical/ASV.IndPres.Aztical.01.jpeg",
						"/Users/benjamin/Documents/3d models/stl/Archvillain Games - 2022-08 - Agama - Shattered Valley/Archvillain Games - Agama - Shattered Valley - Presupported/Agama Aztical/ASV.IndPres.Aztical.02.jpeg",
						"/Users/benjamin/Documents/3d models/stl/Archvillain Games - 2022-08 - Agama - Shattered Valley/Archvillain Games - Agama - Shattered Valley - Presupported/Agama Aztical/ASV.IndPres.Aztical.03.jpeg",
						"/Users/benjamin/Documents/3d models/stl/Archvillain Games - 2022-08 - Agama - Shattered Valley/Archvillain Games - Agama - Shattered Valley - Presupported/Agama Aztical/ASV.IndPres.Aztical.04.jpeg"
					],
					models: [],
					archives: []
				});
			}, 1000);
		})
	};
}
