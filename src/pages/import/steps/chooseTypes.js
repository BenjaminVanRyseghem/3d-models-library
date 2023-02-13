import { arrayOf, func, string } from "prop-types";
import { Checkbox, Typography } from "antd";
import { useWizard } from "react-use-wizard";
import { useWizardError } from "components/wizardWithError/wizardWithError.js";
import AbstractStep from "pages/import/steps/abstractStep.js";
import React from "react";

const { Paragraph } = Typography;
const allTypes = [
	{
		name: "Unsupported",
		value: "unsupported"
	},
	{
		name: "Supported",
		value: "supported"
	},
	{
		name: "Lys file",
		value: "lys"
	}
];

export default function ChooseTypes({ types, setTypes }) {
	let { handleStep } = useWizard();
	let { resetCurrentError } = useWizardError();

	handleStep(() => {
		if (!types.length) {
			throw new Error("At least one type should be chosen");
		}
	});

	function Content() {
		return (<>
			<Paragraph>What types of models are present?</Paragraph>
			<Checkbox.Group defaultValue={types} onChange={(values) => {
				resetCurrentError();
				setTypes(values);
			}}>
				{allTypes.map(({ name, value }, index) => <Checkbox
					key={value}
					autoFocus={index === 0}
					value={value}
				>
					{name}
				</Checkbox>)}
			</Checkbox.Group>
		</>);
	}

	return (
		<AbstractStep content={<Content/>} title={"Choose the types"}/>
	);
}

ChooseTypes.propTypes = {
	setTypes: func.isRequired,
	types: arrayOf(string).isRequired
};
