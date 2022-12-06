const jestConfig = require("client/jest.config.js");
const webpackConfig = require("./webpack.config");

function forEachPcssLoader(config, cb) {
	const filterLoader = array => array.filter(object => JSON.stringify(object).includes("postcss-loader"))

	filterLoader(config.module.rules).forEach(rule => {
		filterLoader(rule.oneOf).forEach(oneOf => {
			cb(oneOf)
		})
	})
}

module.exports = [
	["use-babel-config", ".babelrc"],
	["use-eslint-config", "package"],
	"@princed/rescript-disable-eslint",
	"@benjamin-vanryseghem/rescript-use-postcss-config",
	{
		jest: (config) => {
			let result = Object.assign({}, config, jestConfig);
			result.transform["^.+\\.(js|jsx|ts|tsx)$"] = "babel-jest";
			result.moduleDirectories = webpackConfig.resolve.modules;
			return result;
		},
		webpack: (webpack) => {

			webpack.resolve.modules = webpackConfig.resolve.modules;
			webpack.optimization.splitChunks = webpackConfig.optimization.splitChunks;
			webpack.optimization.runtimeChunk = webpackConfig.optimization.runtimeChunk;
			webpack.output.filename = webpackConfig.output.filename;
			webpack.resolve.alias = Object.assign({}, webpack.resolve.alias, webpackConfig.resolve.alias);
			return webpack;
		}
	}
];
