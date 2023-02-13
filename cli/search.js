import { filterEntities, fuzzyMatchName } from "./filterEntities.js";
import { getData } from "./database.js";
import buildOutput from "./output.js";

function flattenEntities(entities) {
	let result = [];
	entities.forEach((entity) => {
		result.push(entity);
		result.push(...flattenEntities(entity.children));
	});

	return result;
}

export default async function search(opts) {
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

export function searchEntities({ entities, filters, output = (result) => result }) {
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
