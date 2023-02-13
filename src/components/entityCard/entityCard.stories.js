import { action } from "@storybook/addon-actions";
import { BrowserRouter } from "react-router-dom";
import { EntityCardContent } from "./entityCard.js";
import React from "react";

export default {
	component: EntityCardContent,
	title: "src/components/entityCard",
	decorators: [
		(Story) => (<BrowserRouter>
			<Story/>
		</BrowserRouter>)
	]
};

const template = (args) => <EntityCardContent {...args}/>;

export const Shows = template.bind();

Shows.args = {
	navigate: action("navigate"),
	entity: {
		id: "cute-cats",
		name: "Entity name",
		exported: true,
		cover: "https://cdn2.thecatapi.com/images/736.jpg",
		tags: [
			"chibi",
			"nsfw"
		],
		children: []
	}
};
