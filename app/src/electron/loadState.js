// eslint-disable-next-line filenames/match-exported
const root = "/Users/benjamin/Documents/3d models/stl";
let { getData, getEntity} = require("../cli/database.js");
let { searchEntities } = require("../cli/search.js");

let resolveEntitiesPromise = () => {};
let resolveEntitiesAsMapPromise = () => {};
let resolveTagsPromise = () => {};
let resolveKindsPromise = () => {};

let entitiesPromise = new Promise(() => {});
let entitiesAsMapPromise = new Promise(() => {});
let tagsPromise = new Promise(() => {});
let kindsPromise = new Promise(() => {});

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

	kindsPromise = new Promise((resolve) => {
		resolveKindsPromise = resolve;
	});
}

module.exports = {
	async init() {
		reset();
		let { entities, tags, kinds } = await getData(root);
		resolveTagsPromise(tags);
		resolveKindsPromise(kinds);
		resolveEntitiesPromise(entities);
		resolveEntitiesAsMapPromise(true);
	},
	getAllTags() {
		return tagsPromise;
	},
	getAllKinds() {
		return kindsPromise;
	},
	getAllEntities() {
		return entitiesPromise;
	},
	searchEntities(filters) {
		return Promise.all([
			entitiesPromise,
			tagsPromise,
			kindsPromise,
		]).then(([entities, tags, kinds]) => searchEntities({
			entities,
			tags,
			kinds,
			filters
		}));
	},
	getEntity(id) {
		return entitiesAsMapPromise
			.then(() => getEntity(id));
	}
};