// eslint-disable-next-line filenames/match-exported
const { getFiles } = require("../backend/database.js");

const root = "/Users/benjamin/Documents/3d models/stl/untitled folder 2";

let resolveEntitiesPromise = () => {};
let resolveTagsPromise = () => {};

let entitiesPromise = new Promise((resolve) => {
	resolveEntitiesPromise = resolve;
});

let tagsPromise = new Promise((resolve) => {
	resolveTagsPromise = resolve;
});

module.exports = {
	init() {
		return getFiles(root).then(({ entities, tags }) => {
			resolveTagsPromise(tags);
			resolveEntitiesPromise(entities);
		});
	},
	getAllTags() {
		return tagsPromise;
	},
	getAllEntities() {
		return entitiesPromise;
	}
};
