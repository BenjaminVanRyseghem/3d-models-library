import { Image } from "antd";
import { resolveEntityPicture } from "helpers.js";
import classnames from "classnames";
import fallback from "./3d-model-icon.webp";
import PropTypes from "prop-types";
import React from "react";

export default function EntityPicture({ entity, full = false }) {
	let className = classnames({
		"cover-img": true,
		"cover-fit": !full,
		"cover-contain": full
	});

	return (
		<Image
			className={className}
			fallback={fallback}
			preview={false}
			src={resolveEntityPicture({
				entity,
				path: entity.cover
			})}
		/>
	);
}

EntityPicture.propTypes = {
	entity: PropTypes.object.isRequired,
	full: PropTypes.bool
};
