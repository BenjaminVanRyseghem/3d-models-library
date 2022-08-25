/* eslint-disable no-process-env,no-nested-ternary,filenames/match-regex */
module.exports = {
	parser: "@babel/eslint-parser",
	parserOptions: {
		requireConfigFile: false,
		babelOptions: {
			presets: [
				["babel-preset-react-app", false],
				process.env.NODE_ENV === "production"
					? "babel-preset-react-app/prod"
					: process.env.NODE_ENV === "test"
						? "babel-preset-react-app/test"
						: "babel-preset-react-app/dev"
			]
		}
	},
	plugins: ["sort-imports-es6-autofix"],
	extends: [
		"react-app",
		"eslint-config-benjamin-van-ryseghem",
		"plugin:react-hooks/recommended"
	],
	settings: {
		react: {
			version: "detect"
		},
		"import/resolver": "webpack"
	},
	rules: {
		"id-length": [
			"error",
			{
				exceptions: [
					"x",
					"y",
					"i",
					"j",
					"_",
					"t"
				]
			}
		],
		"sort-imports-es6-autofix/sort-imports-es6": [
			"error",
			{
				ignoreCase: true
			}
		],
		"sort-imports": "off",
		"ftgp/indent": "off",
		"jsdoc/no-undefined-types": "off",
		"jsdoc/check-indentation": "off",
		"jsdoc/require-param": "off",
		"jsdoc/require-returns": "off",
		"jsdoc/check-examples": "off",
		"jsdoc/check-tag-names": "off",
		"jsdoc/valid-types": "off",
		"jsdoc/require-jsdoc": "off"
	}
};
