import { func, string } from "prop-types";
import { Radio, Space, Typography } from "antd";
import { useWizard } from "react-use-wizard";
import { useWizardError } from "components/wizardWithError/wizardWithError.js";
import AbstractStep from "pages/import/steps/abstractStep.js";
import React from "react";

let { Paragraph } = Typography;

const kinds = [
	{
		name: "Miniature",
		value: "miniature"
	},
	{
		name: "Statue",
		value: "statue"
	},
	{
		name: "Bust",
		value: "bust"
	},
	{
		name: "Terrain",
		value: "terrain"
	},
	{
		name: "Props",
		value: "props"
	}
];

export default function ChooseKind({ kind, setKind }) {
	let { handleStep } = useWizard();
	let { resetCurrentError } = useWizardError();

	handleStep(() => {
		if (!kind) {
			throw new Error("You should pick a kind");
		}
	});

	function Content() {
		return (<>
				<Paragraph>What is the kind of this entity?</Paragraph>
				<Radio.Group value={kind} onChange={(event) => {
					resetCurrentError();
					setKind(event.target.value);
				}}>
					<Space direction="vertical">
						{
							kinds.map(({ name, value }, index) => <Radio
								key={value}
								autoFocus={(!kind && index === 0) || (kind === value)}
								value={value}
							>
								{name}
							</Radio>)
						}
					</Space>
				</Radio.Group>
			</>
		);
	}

	return (
		<AbstractStep content={<Content/>} title={"Choose the entity kind"}/>
	);
}

ChooseKind.propTypes = {
	kind: string,
	setKind: func.isRequired
};
