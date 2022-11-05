// eslint-disable-next-line filenames/match-exported
const root = "/Users/benjamin/Documents/3d models/stl";

let resolveEntitiesPromise = () => {};
let resolveEntitiesAsMapPromise = () => {};
let resolveTagsPromise = () => {};

let getDatabase = import("../cli/database.js");

let entitiesPromise = new Promise((resolve) => {
	resolveEntitiesPromise = resolve;
});

let entitiesAsMapPromise = new Promise((resolve) => {
	resolveEntitiesAsMapPromise = resolve;
});

let tagsPromise = new Promise((resolve) => {
	resolveTagsPromise = resolve;
});

module.exports = {
	init() {
		return getDatabase
			.then(({ getData }) => getData(root).then(({ entities, tags }) => {
					resolveTagsPromise(tags);
					resolveEntitiesPromise(entities);
					resolveEntitiesAsMapPromise(true);
				}));
	},
	getAllTags() {
		return tagsPromise;
	},
	getAllEntities() {
		return entitiesPromise;
	},
	getEntity(id) {
		return Promise.all([getDatabase, entitiesAsMapPromise])
			.then(([{ getEntity }]) => getEntity(id));
	}
};
