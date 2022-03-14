const { resolve } = require("path");
const { readdir, readFile } = require("fs").promises;

function buildEntity({ data, dir, tags, kinds }) {
	data.local = true;
	data.path = dir;

	(data.tags || []).forEach((tag) => {
		tags[tag] ??= [];
		tags[tag].push(data);
	});

	if (data.kind) {
		kinds[data.kind] ??= [];
		kinds[data.kind].push(data);
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
				.then((data = {}) => ({
					entities: [
						buildEntity({
							data,
							dir,
							tags,
							kinds
						})
					]
				}));
		}
		return dirent.isDirectory()
			? getData(res)
			: Promise.resolve(null);
	};
}

// eslint-disable-next-line max-statements
async function getData(dir) {
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
		if (!local.children.length) {
			local.isLeaf = true;
		}
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

module.exports = {
	getData
};
