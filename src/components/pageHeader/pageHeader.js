import { LeftCircleOutlined } from "@ant-design/icons";
import { PageHeader as RawPageHeader } from "@ant-design/pro-layout";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

export default function PageHeader({ entity, noBack = false, title, extra = [] }) {
	let navigate = useNavigate();

	return (
		<RawPageHeader
			backIcon={noBack ? false : <LeftCircleOutlined/>}
			className="site-page-header-responsive"
			extra={extra}
			title={title}
			onBack={() => {
				if (!entity) {
					navigate(-1);
					return;
				}

				if (!entity.parent) {
					navigate(
						"/",
						{ replace: true }
					);
					return;
				}

				navigate(
					`/entity/${entity.parent}`,
					{ replace: true }
				);
			}}
		/>
	);
}

PageHeader.propTypes = {
	entity: PropTypes.object,
	extra: PropTypes.arrayOf(PropTypes.node),
	noBack: PropTypes.bool,
	title: PropTypes.string.isRequired
};
