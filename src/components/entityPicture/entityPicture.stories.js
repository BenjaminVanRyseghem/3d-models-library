import EntityPicture from "./entityPicture.js";

export default {
	component: EntityPicture,
	title: "src/components/entityPicture",
};

const template = (args) => new EntityPicture(args);

export const Shows = template.bind();

Shows.args = {
	entity: {
		exported: true,
		cover: "https://cdn2.thecatapi.com/images/736.jpg"
	}
};
