// eslint-disable-next-line filenames/match-regex
module.exports = {
	plugins: [
		// eslint-disable-next-line global-require
		require("autoprefixer"),
		// eslint-disable-next-line global-require
		require("postcss-flexbugs-fixes"),
		// eslint-disable-next-line global-require
		require("postcss-preset-env")({
			features: {
				"nesting-rules": true
			}
		})
	]
};
