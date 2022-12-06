import { CloseCircleOutlined } from "@ant-design/icons";
import { func, string } from "prop-types";
import { Input, Typography } from "antd";
import { useWizard } from "react-use-wizard";
import { useWizardError } from "components/wizardWithError/wizardWithError.js";
import AbstractStep from "pages/import/steps/abstractStep.js";
import React from "react";

const { Paragraph } = Typography;

export default function ChooseName({ name, setName }) {
	let { handleStep } = useWizard();
	let { resetCurrentError } = useWizardError();

	handleStep(() => {
		if (!name?.length) {
			throw new Error("You must choose a name");
		}
	});

	function Content() {
		return (<>
			<Paragraph>Please choose a name for the entry</Paragraph>
			<Input autoFocus allowClear={<CloseCircleOutlined/>} value={name} onChange={(event) => {
				resetCurrentError();
				setName(event.target.value);
			}}/>
		</>);
	}

	return (
		<AbstractStep content={<Content/>} title={"Choose the entry name"}/>
	);
}

ChooseName.propTypes = {
	name: string,
	setName: func.isRequired
};
