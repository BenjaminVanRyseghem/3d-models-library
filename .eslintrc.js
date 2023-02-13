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
		"react/jsx-first-prop-new-line": ["error", "multiline-multiprop"],
		"react/jsx-max-props-per-line": ["error", { maximum: 1 }],
		"react/jsx-indent-props": ["error", "tab"],
		"react/jsx-closing-tag-location": ["error"],
		"react/jsx-wrap-multilines": ["error"],
		"react/jsx-closing-bracket-location": ["error", "line-aligned"],
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
