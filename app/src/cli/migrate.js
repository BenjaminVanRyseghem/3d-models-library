const { getData, version } = require("./database.js");
const { jsonFileName } = require("./constants.js");
const { writeFile } = require("fs/promises");
const path = require("path");

const migrationTable = {
	1: (entity) => {
		if (entity.picture) {
			entity.cover = entity.picture;
			delete entity.picture;
		}
		return entity;
	}
};

module.exports = async function migrate(opts) {
	let dbData = await getData(opts.root);
	return Promise.all(dbData.entities.map((entity) => migrateEntity({ entity })));
}

module.exports.migrateEntity = async function migrateEntity({ entity: oldEntity, preventTraverse = false }) {
	let entity = await applyMigrations(oldEntity);

	if (!preventTraverse) {
		await Promise.all(entity.children.map((child) => migrateEntity({ entity: child })));
	}

	let file = path.resolve(entity.path, jsonFileName);
	delete entity.path;
	await writeFile(file, JSON.stringify(entity, null, 2));
	return entity;
}

async function applyMigrations(entity) {
	let current = entity;

	while (current.version < version) {
		// eslint-disable-next-line no-await-in-loop
		current = await applyMigration(current, migrationTable[current.version]);
	}

	return current;
}

async function applyMigration(entity, migrationFn) {
	if (!migrationFn) {
		throw new Error(`Missing migration function for version ${entity.version}`);
	}
	let result = await migrationFn(entity);
	result.version = entity.version + 1;
	return result;
}
