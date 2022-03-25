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

	if (opts.tag && opts.tag.length === 1) {
		return output(fuzzyMatchName(dbData.tags[opts.tag[0]], opts.name));
	}

	if (opts.kind && opts.kind.length === 1) {
		return output(fuzzyMatchName(dbData.kinds[opts.kind[0]], opts.name));
	}

	if (opts.tag || opts.kind) {
		return output(fuzzyMatchName(filterEntities(dbData.entities, {
			tags: opts.tag,
			kinds: opts.kind
		}), opts.name));
	}

	if (opts.name) {
		return output(fuzzyMatchName(flattenEntities(dbData.entities), opts.name));
	}

	return output(dbData.entities);
}
