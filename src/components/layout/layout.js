import "./layout.scss";
import { Outlet } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

export default class Layout extends React.Component {
	static defaultProps = {};

	static propTypes = {
		children: PropTypes.node
	};

	state = {};

	render() {
		return (
			<div className="layout">
				<Outlet/>
			</div>
		);
	}
}
