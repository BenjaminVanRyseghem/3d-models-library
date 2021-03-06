import { getData, version } from "./database.js";
import { writeFile } from "fs/promises";
import path from "path";

const migrationTable = {
	1: (entity) => {
		if (entity.picture) {
			entity.cover = entity.picture;
			delete entity.picture;
		}
		return entity;
	}
};

export default async function migrate(opts) {
	let dbData = await getData(opts.root);
	return Promise.all(dbData.entities.map((entity) => migrateEntity({ entity })));
}

export async function migrateEntity({ entity: oldEntity, preventTraverse = false }) {
	let entity = await applyMigrations(oldEntity);

	if (!preventTraverse) {
		await Promise.all(entity.children.map((child) => migrateEntity({ entity: child })));
	}

	let file = path.resolve(entity.path, ".3d-model-entity.json");
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
