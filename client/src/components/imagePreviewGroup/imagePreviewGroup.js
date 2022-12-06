import { Button, Image } from "antd";
import PropTypes from "prop-types";
import React, { useState } from "react";

export default function ImagePreviewGroup({ title, sources }) {
	const [visible, setVisible] = useState(false);
	const [current, setCurrent] = useState(0);

	return (
		<>
			{sources.map((src, index) => <Button
				key={src}
				type="primary"
				onClick={() => {
					setCurrent(index);
					setVisible(true);
				}}
			>
				{title}
			</Button>)}
			<Image.PreviewGroup
				preview={{
					current,
					visible,
					onVisibleChange: (value) => {
						setVisible(value);
					}
				}}
			>
				{sources.map((src) => <Image
					key={src}
					src={src}
				/>)}
			</Image.PreviewGroup>
		</>
	);
}

ImagePreviewGroup.propTypes = {
	sources: PropTypes.arrayOf(PropTypes.string).isRequired,
	title: PropTypes.node.isRequired
};
