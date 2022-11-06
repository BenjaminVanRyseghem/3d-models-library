// eslint-disable-next-line filenames/match-exported
const root = "/Users/benjamin/Documents/3d models/stl";
let getDatabase = import("../cli/database.js");

let resolveEntitiesPromise = () => {};
let resolveEntitiesAsMapPromise = () => {};
let resolveTagsPromise = () => {};

let entitiesPromise = new Promise(() => {});
let entitiesAsMapPromise = new Promise(() => {});
let tagsPromise = new Promise(() => {});

function reset() {
	entitiesPromise = new Promise((resolve) => {
		resolveEntitiesPromise = resolve;
	});

	entitiesAsMapPromise = new Promise((resolve) => {
		resolveEntitiesAsMapPromise = resolve;
	});

	tagsPromise = new Promise((resolve) => {
		resolveTagsPromise = resolve;
	});
}

module.exports = {
	async init() {
		reset();
		let { getData } = await getDatabase;
		let { entities, tags } = await getData(root);
		resolveTagsPromise(tags);
		resolveEntitiesPromise(entities);
		resolveEntitiesAsMapPromise(true);
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
