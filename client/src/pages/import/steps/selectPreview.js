import { arrayOf, func, shape, string } from "prop-types";
import { PreviewStlList } from "components/previewStlList/previewStlList.js";
import { useWizard } from "react-use-wizard";
import React from "react";

export default function SelectPreview({ setPreview, stlFiles }) {
	let { handleStep } = useWizard();

	handleStep(() => new Promise((resolve, reject) => {
		let [canvas] = document.getElementsByTagName("canvas");
		canvas.toBlob((exportedBlob) => {
			if (exportedBlob === null) {
				reject(new Error("Error while generating the preview"));
				return;
			}

			exportedBlob.arrayBuffer()
				.then((buffer) => {
					setPreview(buffer);
					resolve();
				})
				.catch(reject);
		});
	}));

	return (
		<div className="SelectPreview">
			<PreviewStlList stlFiles={stlFiles}/>
		</div>
	);
}

SelectPreview.propTypes = {
	setPreview: func.isRequired,
	stlFiles: arrayOf(shape({
		label: string,
		path: string
	})).isRequired
};
