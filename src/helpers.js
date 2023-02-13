export function resolveEntityPicture({ entity, path = "" }) {
	return entity.exported ? path : asLocalResource(`${entity.path}/${path}`);
}

export function asLocalResource(path) {
	return `resource://${path}`;
}
