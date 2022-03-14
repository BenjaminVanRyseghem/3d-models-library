const Fuse = require("fuse.js");

function searchFiltersAndKinds(entity, tags, kinds) {
	let remainingTags = entity.tags ? tags.filter((tag) => entity.tags.indexOf(tag) === -1) : tags;

	let remainingKinds = { ...kinds };
	delete remainingKinds[entity.kind];

	return {
		remainingTags,
		remainingKinds
	};
}

function innerFilterEntities(entities, { tags, kinds }) {
	let result = [];
	entities.forEach((entity) => {
		let {
			remainingTags,
			remainingKinds
		} = searchFiltersAndKinds(entity, tags, kinds);

		if (!remainingTags.length && !remainingKinds.length) {
			result.push(entity);
		}
		result.push(...innerFilterEntities(entity.children, {
			tags: remainingTags,
			kinds: remainingKinds
		}));
	});

	return result;
}

function filterEntities(entities, { tags, kinds }) {
	return innerFilterEntities(entities, {
		tags,
		kinds
	});
}

function fuzzyMatchName(entities, name) {
	if (!name) {
		return entities;
	}

	let fuse = new Fuse(entities, { keys: ["name"] });
	return fuse.search(name);
}

module.exports = {
	filterEntities,
	fuzzyMatchName
};
