const { getFiles } = require("../backend/database.js");

function buildOutput(humanReadable) {
	if (humanReadable) {
		// eslint-disable-next-line no-console
		return (object) => { console.log(JSON.stringify(object, null, 2)); };
	}
	// eslint-disable-next-line no-console
	return (object) => { console.log(JSON.stringify(object,)); };
}

function searchFiltersAndKinds(entity, tags, kinds) {
	let remainingTags = entity.tags ? tags.filter((tag) => entity.tags.indexOf(tag) === -1) : tags;

	let remainingKinds = { ...kinds };
	delete remainingKinds[entity.kind];

	return {
		remainingTags,
		remainingKinds
	};
}

function filterEntities(entities, { tags, kinds }) {
	let result = [];
	entities.forEach((entity) => {
		let {
			remainingTags,
			remainingKinds
		} = searchFiltersAndKinds(entity, tags, kinds);

		if (!remainingTags.length && !remainingKinds.length) {
			result.push(entity);
		}
		result.push(...filterEntities(entity.children, {
			tags: remainingTags,
			kinds: remainingKinds
		}));
	});

	return result;
}
async function search(opts) {
	let output = buildOutput(opts.human);

	let allFiles = await getFiles(opts.root);

	if (opts.tag && opts.tag.length === 1) {
		output(allFiles.tags[opts.tag[0]]);
		return;
	}

	if (opts.kind && opts.kind.length === 1) {
		output(allFiles.kinds[opts.kind[0]]);
		return;
	}

	if (opts.tag || opts.kind) {
		output(filterEntities(allFiles.entities, {
			tags: opts.tag,
			kinds: opts.kind
		}));
		return;
	}
	output(allFiles.entities);
}

module.exports = search;
