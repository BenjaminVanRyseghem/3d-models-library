import { asLocalResource } from "helpers.js";
import { Descriptions, Typography } from "antd";
import { node, number, object } from "prop-types";
import AbstractStep from "pages/import/steps/abstractStep.js";
import ImagePreview from "components/imagePreview/imagePreview.js";
import React from "react";

const { Text } = Typography;

const EllipsisMiddle = ({ suffixCount, children }) => {
	const start = children.slice(0, children.length - suffixCount).trim();
	const suffix = children.slice(-suffixCount).trim();

	return (
		<Text
			ellipsis={{
				suffix
			}}
			style={{
				// maxWidth: "100%"
			}}
		>
			{start}
		</Text>
	);
};

export default function Summary({ info }) {
	function Content() {
		let coverSource = asLocalResource(info.cover);

		if (!info.cover && info.preview) {
			let blob = new Blob([info.preview]);
			coverSource = URL.createObjectURL(blob);
		}

		return (<Descriptions bordered column={2}>
				<Descriptions.Item className="ellipsis-content" label="Folder" span={2}><EllipsisMiddle suffixCount={12}>{info.folderPath}</EllipsisMiddle></Descriptions.Item>
				<Descriptions.Item label="Name">{info.name}</Descriptions.Item>
				<Descriptions.Item label="Picture"><ImagePreview src={coverSource} title={"Cover"}/></Descriptions.Item>
				<Descriptions.Item label="Kind">{info.kind}</Descriptions.Item>
				<Descriptions.Item label="Tags">{info.tags.join(", ") || "-"}</Descriptions.Item>
				<Descriptions.Item label="Types">{info.types.join(", ")}</Descriptions.Item>
			</Descriptions>
		);
	}

	return (
		<AbstractStep content={<Content/>} title={"Summary"}/>
	);
}

EllipsisMiddle.propTypes = {
	children: node.isRequired,
	suffixCount: number.isRequired
};

Summary.propTypes = {
	info: object.isRequired
};
