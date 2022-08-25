// eslint-disable-next-line filenames/match-exported
const { v4: uuidv4 } = require("uuid");

const root = "/Users/benjamin/Documents/3d models/stl/Archvillain Games - 2022-08 - Agama - Shattered Valley";

let resolveEntitiesPromise = () => {};
let resolveEntitiesAsMapPromise = () => {};
let resolveTagsPromise = () => {};

let entitiesPromise = new Promise((resolve) => {
	resolveEntitiesPromise = resolve;
});

let entitiesAsMapPromise = new Promise((resolve) => {
	resolveEntitiesAsMapPromise = resolve;
});

let tagsPromise = new Promise((resolve) => {
	resolveTagsPromise = resolve;
});

function appendToMap(entity, map = {}) {
	entity.id ??= uuidv4();
	map[entity.id] = entity;

	entity.children.forEach((child) => {
		appendToMap(child, map);
	});
}

module.exports = {
	init() {
		return import("../cli/database.js")
			.then(({ getData }) => getData(root).then(({ entities, tags }) => {
					resolveTagsPromise(tags);
					resolveEntitiesPromise(entities);

					let entitiesMap = {};
					entities.forEach((entity) => {
						appendToMap(entity, entitiesMap);
					});

					resolveEntitiesAsMapPromise(entitiesMap);
				}));
	},
	getAllTags() {
		return tagsPromise;
	},
	getAllEntities() {
		return entitiesPromise;
	},
	getEntity(id) {
		return entitiesAsMapPromise.then((map) => map[id]);
	}
};
