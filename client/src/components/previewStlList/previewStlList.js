import "./previewStlList.css";
import { arrayOf, func, shape, string } from "prop-types";
import PreviewStl from "components/previewStl/previewStl.js";
import React, { useState } from "react";

function StlMenuEntry({ stlFile, onClick }) {
	return (
		<div className="menu entry" onClick={() => onClick(stlFile)}>{stlFile.label}</div>
	);
}

export function PreviewStlList({ stlFiles = [] }) {
	let [currentStlFile, setCurrentStlFile] = useState(stlFiles[0]);
	return (
		<div className="PreviewStlList">
			<PreviewStl fileUrl={currentStlFile.path}/>
			<div className="files">{
				stlFiles.map((stlFile) => <StlMenuEntry
					key={stlFile.path}
					stlFile={stlFile}
					onClick={setCurrentStlFile}
				/>)
			}</div>
		</div>
	);
}

StlMenuEntry.propTypes = {
	onClick: func,
	stlFile: shape({
		label: string,
		path: string
	}).isRequired
};

PreviewStlList.propTypes = {
	stlFiles: arrayOf(shape({
		label: string,
		path: string
	})).isRequired
};
