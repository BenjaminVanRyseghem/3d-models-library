const { getData } = require("../backend/database.js");
const {
	filterEntities,
	fuzzyMatchName
} = require("../backend/filterEntities.js");

function buildOutput(humanReadable) {
	if (humanReadable) {
		// eslint-disable-next-line no-console
		return (object) => { console.log(JSON.stringify(object, null, 2)); };
	}
	// eslint-disable-next-line no-console
	return (object) => { console.log(JSON.stringify(object,)); };
}

function flattenEntities(entities) {
	let result = [];
	entities.forEach((entity) => {
		result.push(entity);
		result.push(...flattenEntities(entity.children));
	});

	return result;
}

async function search(opts) {
	let output = buildOutput(opts.human);

	let dbData = await getData(opts.root);

	if (opts.tag && opts.tag.length === 1) {
		output(fuzzyMatchName(dbData.tags[opts.tag[0]], opts.name));
		return;
	}

	if (opts.kind && opts.kind.length === 1) {
		output(fuzzyMatchName(dbData.kinds[opts.kind[0]], opts.name));
		return;
	}

	if (opts.tag || opts.kind) {
		output(fuzzyMatchName(filterEntities(dbData.entities, {
			tags: opts.tag,
			kinds: opts.kind
		}), opts.name));
		return;
	}

	if (opts.name) {
		output(fuzzyMatchName(flattenEntities(dbData.entities), opts.name));
		return;
	}

	output(dbData.entities);
}

module.exports = search;
