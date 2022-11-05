import "./previewStl.css";
import { Colorpicker } from "antd-colorpicker";
import { Spin } from "antd";
import { StlViewer } from "react-stl-viewer";
import { string } from "prop-types";
import { useElectronAPIPromise } from "hooks.js";
import React, { useCallback, useState } from "react";

const style = {
	top: 0,
	left: 0,
	width: "100%",
	height: "500px"
};

export default function PreviewStl({ fileUrl }) {
	let [color, setColor] = useState({
		hex: "#A7A7A7",
		source: "hex"
	});
	let [stlContent, setStlContent] = useState();
	let getStlContent = useCallback((api) => api.getStlContent(fileUrl), [fileUrl]);
	useElectronAPIPromise(getStlContent).then(setStlContent);

	if (!stlContent) {
		return <Spin size="large"/>;
	}

	let blob = new Blob([stlContent.buffer]);
	let url = URL.createObjectURL(blob);

	return (
		<div className="PreviewStl">
			<div className="actions">
				<div className="action color">
					<Colorpicker
						popup
						picker="ChromePicker"
						value={color}
						onColorResult={setColor}
					/>
				</div>
			</div>
			<StlViewer
				orbitControls
				shadows
				className="viewer"
				modelProps={{ color: color.hex }}
				style={style}
				url={url}
			/>
		</div>
	);
}

PreviewStl.propTypes = {
	fileUrl: string.isRequired
};
