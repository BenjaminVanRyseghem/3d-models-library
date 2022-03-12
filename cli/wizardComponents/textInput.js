const { Component } = require("wizard");

class textInput extends Component {
	constructor(question, styles) {
		super(styles);
	}

	init() {
		return new Promise((resolve) => {
			this.onKeyDown = (...args) => {
				this.write(...args);
				// this.write("Space Pressed!").then(() => {
				// 	resolve("true");
				// });
			};

			this.onKeyEnter = () => {resolve("foo")};

			this.initialize("My new input!");
		});
	}

	update() {}
}

module.exports = textInput;
