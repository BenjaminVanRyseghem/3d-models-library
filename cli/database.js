import { jsonFileName } from "./constants.js";
import { migrateEntity } from "./migrate.js";
import { readdir, readFile, writeFile } from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import path, { dirname, resolve, sep } from "path";

export const version = 2;
const entitiesMap = {};
const pathToEntity = {};

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

		appendToMap(local);

		local.children.forEach((child) => {
			child.parent = local.id;
		});

		return {
			entities: [local],
			tags: allTags,
			kinds: allKinds
		};
	}

	let entities = Array.prototype.concat(...allEntities.filter((each) => !!each));

	entities.forEach((entity) => {
		appendToMap(entity);
	});

	return {
		entities,
		tags: allTags,
		kinds: allKinds
	};
}

export function getEntity(id) {
	return entitiesMap[id];
}

export function resolveParenthood({ folderPath, entity }) {
	let parentEntity = getParentEntity({ folderPath });
	if (!parentEntity) {
		return;
	}

	parentEntity.children ??= [];
	parentEntity.children.push(entity);
	entity.parent = parentEntity.id;
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
		if (dirent.name === jsonFileName) {
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

function getParentEntity({ folderPath }) {
	let parentFolder = getParentFolder(folderPath);
	if (!parentFolder) {
		return null;
	}

	if (dirname(parentFolder) === parentFolder) {
		// you hit root folder
		return null;
	}

	if (!pathToEntity[parentFolder]) {
		return getParentEntity({ folderPath: parentFolder });
	}

	return pathToEntity[parentFolder];
}

function getParentFolder(folder) {
	let segments = folder.split(sep);
	segments.pop();
	if (segments[0] === "") {
		segments.shift();
		segments.unshift(sep);
	}
	return resolve(...segments);
}

function appendToMap(entity, map = entitiesMap) {
	let shouldUpdate = shouldUpdateEntity(entity);
	entity.id ??= uuidv4();
	map[entity.id] = entity;
	pathToEntity[entity.path] = entity;

	if (shouldUpdate) {
		writeEntity(entity);
	}

	entity.children.forEach((child) => {
		appendToMap(child, map);
	});
}

function shouldUpdateEntity(entity) {
	return !entity.id || entity.parent;
}

function writeEntity(entity) {
	let {
		children: _,
		path: __,
		parent: ___,
		...toWrite
	} = entity;
	writeFile(path.resolve(entity.path, jsonFileName), JSON.stringify(toWrite, null, 2));
}

