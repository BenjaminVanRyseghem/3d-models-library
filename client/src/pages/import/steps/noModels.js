import { useWizardError } from "components/wizardWithError/wizardWithError.js";
import { bool, func } from "prop-types";
import { Typography } from "antd";
import { useWizard } from "react-use-wizard";
import AbstractStep from "pages/import/steps/abstractStep.js";
import React from "react";
import VerboseSwitch from "components/verboseSwitch/verboseSwitch.js";

let { Paragraph } = Typography;

export default function NoModels({ confirmNoModel, setConfirmNoModel }) {
	let { handleStep } = useWizard();
	let { resetCurrentError } = useWizardError();

	handleStep(() => {
		if (!confirmNoModel) {
			throw new Error("You must confirm that you want to proceed");
		}
	});

	function Content() {
		return (<>
				<Paragraph>No models were found inside the selected folder.</Paragraph>
				<Paragraph>Are you sure it is ok?</Paragraph>
				<VerboseSwitch autoFocus checked={confirmNoModel} onChange={(confirmation) => {
					resetCurrentError();
					return setConfirmNoModel(confirmation);
				}}/>
			</>
		);
	}

	return (
		<AbstractStep content={<Content/>} title={"No models found"}/>
	);
}

NoModels.propTypes = {
	confirmNoModel: bool.isRequired,
	setConfirmNoModel: func.isRequired
};
