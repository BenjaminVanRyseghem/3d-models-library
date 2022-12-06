const { filterEntities, fuzzyMatchName } = require("./filterEntities.js");
const { getData } = require("./database.js");
const buildOutput = require("./output.js");

function flattenEntities(entities) {
	let result = [];
	entities.forEach((entity) => {
		result.push(entity);
		result.push(...flattenEntities(entity.children));
	});

	return result;
}

module.exports = async function search(opts) {
	let output = buildOutput(opts);

	let dbData = await getData(opts.root);

	return searchEntities({
		entities: dbData.entities,
		tags: dbData.tags,
		kinds: dbData.kinds,
		filters: opts,
		output
	});
}

module.exports.searchEntities = function searchEntities({ entities, filters, output = (result) => result }) {
	if (filters.tag?.length || filters.kind?.length) {
		return output(fuzzyMatchName(filterEntities(entities, {
			tags: filters.tag,
			kinds: filters.kind
		}), filters.name));
	}

	if (filters.name) {
		return output(fuzzyMatchName(flattenEntities(entities), filters.name));
	}

	return output(entities);
}
