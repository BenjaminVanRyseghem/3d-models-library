/* eslint-disable filenames/match-regex */
const BabelRcPlugin = require("@jackwilsdon/craco-use-babelrc");
const jestConfig = require("./jest.config.js");
const webpackConfig = require("./webpack.config.js");
const fixPostCss = require("@benjamin-vanryseghem/rescript-use-postcss-config");

module.exports = {
	plugins: [{ plugin: BabelRcPlugin }],
	eslint: {
		mode: "file"
	},
	jest: {
		configure: (config) => {
			let result = Object.assign({}, config, jestConfig);
			result.transform["^.+\\.(js|jsx|ts|tsx)$"] = "babel-jest";
			result.moduleDirectories = webpackConfig.resolve.modules;
			return result;
		}
	},
	webpack: {
		configure: (webpack) => {
			fixPostCss(webpack);
			webpack.plugins = webpack.plugins.filter((plugin) => plugin.key !== "ESLintWebpackPlugin");
			webpack.resolve.modules = webpackConfig.resolve.modules;
			webpack.optimization.splitChunks = webpackConfig.optimization.splitChunks;
			webpack.optimization.runtimeChunk = webpackConfig.optimization.runtimeChunk;
			webpack.output.filename = webpackConfig.output.filename;
			webpack.resolve.alias = Object.assign({}, webpack.resolve.alias, webpackConfig.resolve.alias);
			return webpack;
		}
	}
};
