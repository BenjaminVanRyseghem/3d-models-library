import { BrowserRouter } from "react-router-dom";
import Home from "./home.js";
import React from "react";

export default {
	component: Home,
	title: "src/pages/home",
	decorators: [
		(Story) => (<BrowserRouter>
			<Story/>
		</BrowserRouter>)
	]
};

const template = (args) => <Home {...args} />;

export const Shows = template.bind();
export const ShowsLoading = template.bind();

Shows.args = {
	electronAPI: {
		setTitle: () => {},
		getAllEntities: () => Promise.resolve([
			{
				name: "Entity name",
				children: []
			}
		])
	}
};

ShowsLoading.args = {
	electronAPI: {
		setTitle: () => {},
		getAllEntities: () => new Promise(() => {})
	}
};
