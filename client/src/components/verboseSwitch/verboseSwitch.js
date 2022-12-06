import { node } from "prop-types";
import { Switch, Typography } from "antd";
import React from "react";

let { Paragraph } = Typography;

export default function VerboseSwitch({ uncheckedLabel = "No ", checkedLabel = " Yes", ...switchProps }) {
	return (
		<Paragraph>{uncheckedLabel} <Switch {...switchProps}/> {checkedLabel}</Paragraph>
	);
}

VerboseSwitch.propTypes = {
	...Switch.propTypes,
	checkedLabel: node,
	uncheckedLabel: node
};
