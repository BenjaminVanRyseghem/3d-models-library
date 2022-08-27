import { Typography } from "antd";
import AbstractStep from "pages/import/steps/abstractStep.js";
import React from "react";

let { Paragraph } = Typography;

function Content() {
	return (<>
			<Paragraph>Welcome to the import wizard.</Paragraph>
			<Paragraph>You will soon go through the process of selecting a folder, and import it.</Paragraph>
			<Paragraph>{"Ready? Then click the \"Next\" button!"}</Paragraph>
		</>
	);
}

export default function Introduction() {
	return (
		<AbstractStep content={<Content/>} title={"Introduction"}/>
	);
}
