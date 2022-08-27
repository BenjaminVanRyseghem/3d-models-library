import { LeftCircleOutlined } from "@ant-design/icons";
import { PageHeader as RawPageHeader } from "antd";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

export default function PageHeader({ noBack = false, title, extra = [] }) {
	let navigate = useNavigate();

	return (
		<RawPageHeader
			backIcon={noBack ? false : <LeftCircleOutlined/>}
			className="site-page-header-responsive"
			extra={extra}
			title={title}
			onBack={() => navigate(-1)}
		/>
	);
}

PageHeader.propTypes = {
	extra: PropTypes.arrayOf(PropTypes.node),
	noBack: PropTypes.bool,
	title: PropTypes.string.isRequired
};
