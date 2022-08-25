/* eslint-disable global-require */
// eslint-disable-next-line filenames/match-regex
module.exports = {
	plugins: [
		require("autoprefixer"),
		require("postcss-flexbugs-fixes"),
		require("postcss-preset-env")({
			features: {
				"nesting-rules": true
			}
		})
	]
};
