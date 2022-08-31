import { Button, Image } from "antd";
import PropTypes from "prop-types";
import React, { useState } from "react";

export default function ImagePreview({ title, src }) {
	const [visible, setVisible] = useState(false);

	return (
		<>
			<Button type="primary" onClick={() => setVisible(true)}>
				{title}
			</Button>
			<Image
				preview={{
					visible,
					src,
					onVisibleChange: (value) => {
						setVisible(value);
					}
				}}
				src={src}
				style={{ display: "none" }}
			/>
		</>
	);
}

ImagePreview.propTypes = {
	src: PropTypes.string.isRequired,
	title: PropTypes.node.isRequired
};
