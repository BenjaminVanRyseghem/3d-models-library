import { migrateEntity } from "./migrate.js";
import { readdir, readFile } from "fs/promises";
import { resolve } from "path";

export const version = 2;

// eslint-disable-next-line max-statements
export async function getData(dir) {
	let newTags = {};
	let newKinds = {};
	let dirents = await readdir(dir, { withFileTypes: true });
	let files = await Promise.all(dirents.map(traverseFolder({
		dir,
		tags: newTags,
		kinds: newKinds
	})));

	let allEntities = [];
	let allTags = newTags;
	let allKinds = newKinds;

	files.forEach((file) => {
		if (!file) {
			return;
		}
		let { entities, tags, kinds } = file;

		entities && allEntities.push(...entities);
		if (tags) {
			Object.assign(allTags, tags);
		}
		if (kinds) {
			Object.assign(allKinds, kinds);
		}
	});

	allEntities = allEntities.sort((one, another) => (one.name < another.name ? -1 : 1));

	let local = allEntities.find((each) => each?.local);

	if (local) {
		delete local.local;
		let children = allEntities.filter((each) => each && each !== local);

		local.children = Array.prototype.concat(...children);

		return {
			entities: [local],
			tags: allTags,
			kinds: allKinds
		};
	}

	return {
		entities: Array.prototype.concat(...allEntities.filter((each) => !!each)),
		tags: allTags,
		kinds: allKinds
	};
}

function buildEntity({ data, dir, tags, kinds }) {
	data.local = true;
	data.path = dir;
	data.tags ||= [];

	data.tags = data.tags.filter(Boolean);

	data.tags.forEach((tag) => {
		tags[tag] ??= [];
		tags[tag].push(data);
	});

	if (data.kind) {
		kinds[data.kind] ??= [];
		kinds[data.kind].push(data);
	}

	if (data.version < version) {
		return migrateEntity({
			entity: data,
			preventTraverse: true
		});
	}

	return data;
}

function traverseFolder({ dir, tags, kinds }) {
	return (dirent) => {
		let res = resolve(dir, dirent.name);
		if (dirent.name === ".3d-model-entity.json") {
			return readFile(res)
				.then((buffer) => {
					try {
						return JSON.parse(buffer.toString());
					} catch {
						return {};
					}
				})
				.then((data = {}) => buildEntity({
					data,
					dir,
					tags,
					kinds
				}))
				.then((entity = {}) => ({
					entities: [entity]
				}));
		}
		return dirent.isDirectory() ? getData(res) : Promise.resolve(null);
	};
}
