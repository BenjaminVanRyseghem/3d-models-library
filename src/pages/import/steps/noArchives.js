import { bool, func } from "prop-types";
import { Typography } from "antd";
import AbstractStep from "pages/import/steps/abstractStep.js";
import React from "react";
import VerboseSwitch from "components/verboseSwitch/verboseSwitch.js";

let { Paragraph } = Typography;

export default function NoArchives({ createArchive, setCreateArchive }) {
	function Content() {
		return (<>
				<Paragraph>No archive detected inside the selected folder.</Paragraph>
				<Paragraph>Do you want me to create one for you?</Paragraph>
				<VerboseSwitch autoFocus checked={createArchive} onChange={setCreateArchive}/>
			</>
		);
	}

	return (
		<AbstractStep content={<Content/>} title={"No archive found"}/>
	);
}

NoArchives.propTypes = {
	createArchive: bool.isRequired,
	setCreateArchive: func.isRequired
};
