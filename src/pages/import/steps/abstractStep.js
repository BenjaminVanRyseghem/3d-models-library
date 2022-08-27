import { Divider, Typography } from "antd";
import PropTypes from "prop-types";
import React from "react";

let { Title } = Typography;

export default function AbstractStep({ title, content }) {
	return (
		<Typography>
			<Title ellipsis className="wizard-step-title">{title}</Title>
			<Divider plain/>
			<div className="wizard-step-content-container">
				<div className="wizard-step-content">{content}</div>
			</div>
		</Typography>
	);
}

AbstractStep.propTypes = {
	content: PropTypes.node.isRequired,
	title: PropTypes.string.isRequired
};
