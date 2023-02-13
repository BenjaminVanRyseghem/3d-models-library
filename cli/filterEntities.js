import Fuse from "fuse.js";

export function filterEntities(entities, { tags, kinds }) {
	return innerFilterEntities(entities, {
		tags,
		kinds
	});
}

export function fuzzyMatchName(entities, name) {
	if (!name) {
		return entities;
	}
	let fuse = new Fuse(entities, {
		threshold: 0.3,
		keys: ["name"]
	});

	return fuse.search(name).map((each) => each.item);
}

function searchFiltersAndKinds(entity, tags = [], kinds = []) {
	let remainingTags = entity.tags ? tags.filter((tag) => entity.tags.indexOf(tag) === -1) : tags;

	let matchKind = kinds.length === 0 || kinds.some((each) => each === entity.kind);

	return {
		remainingTags,
		matchKind
	};
}

function innerFilterEntities(entities, { tags, kinds }) {
	let result = [];
	entities.forEach((entity) => {
		let {
			remainingTags,
			matchKind
		} = searchFiltersAndKinds(entity, tags, kinds);

		if (!remainingTags.length && matchKind) {
			result.push(entity);
		}
		result.push(...innerFilterEntities(entity.children, {
			tags: remainingTags.length ? remainingTags : tags,
			kinds
		}));
	});

	return result;
}
