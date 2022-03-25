const path = require("path");

module.exports = {
	stories: ["../**/*.stories.js"],
	addons: [
		"@storybook/addon-actions/register",
		"@storybook/addon-links/register",
		{
			name: "@storybook/addon-postcss",
			options: {
				postcssLoaderOptions: {
					implementation: require("postcss"),
				}
			}
		},
		{
			name: "@storybook/addon-docs",
			options: { configureJSX: true },
		},
	],
	staticDirs: [
		"../public"
	],
	webpackFinal: async (config) => {
		config.resolve.modules = [
			path.resolve(__dirname, "..", "src"),
			"node_modules"
		];
		return config;
	},
};
