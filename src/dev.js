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
		getAllTags: () => Promise.resolve([]),
		getAllEntities: () => loadData,
		getEntity: (id) => loadData.then((data) => findEntity(id, data)),
		selectFolder: () => new Promise((resolve) => {
			setTimeout(() => {
				resolve("/Users/foo/path to the/folder");
			}, 1000);
		})
	};
}
