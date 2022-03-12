module.exports = {
	"presets": [
		[
			"@babel/preset-env",
			{
				"targets": "defaults"
			}
		],
		"react-app"
	],
	"plugins": [
		"@babel/plugin-proposal-class-properties",
		[
			"babel-plugin-named-asset-import",
			{
				"loaderMap": {
					"svg": {
						"ReactComponent": "@svgr/webpack?-svgo,+ref![path]"
					}
				}
			}
		]
	],
	"env": {
		"test": {
			"plugins": [
				"rewire"
			]
		}
	}
}
