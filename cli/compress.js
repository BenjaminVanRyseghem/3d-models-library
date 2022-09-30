import { readdir } from "fs/promises";
import path from "path";
import trash from "trash";
import Zip from "adm-zip";

const modelExtensions = [".stl", ".lys", ".ctb", ".obj"];
const textExtensions = [".md", ".txt", ".info"];
const pictureExtensions = [".png", ".jpg", ".jpeg", ".webp"];

const allowedExtensions = [
	...modelExtensions,
	...textExtensions,
	...pictureExtensions
];

export async function compress({ folder, name, deleteFiles = false }) {
	let zip = new Zip();
	let dirents = await readdir(folder, { withFileTypes: true });
	let toRemove = [];

	dirents.forEach((dirent) => {
		if (!isCompressible(dirent)) {
			return;
		}
		let fullPath = path.resolve(folder, dirent.name);
		if (!isPicture(dirent)) {
			toRemove.push(fullPath);
		}
		zip.addLocalFile(fullPath);
	});

	await zip.writeZipPromise(path.resolve(folder, `${name}.zip`));
	if (!deleteFiles) {
		return;
	}

	await trash(toRemove, { glob: false });
}

function isPicture(dirent) {
	if (!dirent.isFile()) {
		return false;
	}

	let ext = path.extname(dirent.name).toLowerCase();
	return pictureExtensions.indexOf(ext) !== -1;
}

function isCompressible(dirent) {
	if (dirent.name.startsWith(".")) {
		return false;
	}

	if (dirent.isFile()) {
		let ext = path.extname(dirent.name).toLowerCase();
		return allowedExtensions.indexOf(ext) !== -1;
	}

	return false; // do go recursive, for now at least?
}
