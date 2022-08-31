import { Button, Typography } from "antd";
import { useElectronAPI } from "hooks.js";
import { useWizard } from "react-use-wizard";
import { useWizardError } from "components/wizardWithError/wizardWithError.js";
import AbstractStep from "pages/import/steps/abstractStep.js";
import PropTypes from "prop-types";
import React, { useState } from "react";

let { Paragraph, Text } = Typography;

export default function SelectFolder({ info, setInfo }) {
	let [isLoading, setIsLoading] = useState(false);
	let electronAPI = useElectronAPI();
	let { handleStep } = useWizard();
	let { resetCurrentError } = useWizardError();

	handleStep(() => {
		if (!info.folderPath) {
			throw new Error("You must select a folder");
		}
	});

	function Content() {
		if (isLoading) {
			return "LOADING";
		}

		return (<>
				{
					!info.folderPath &&
					<Paragraph className="select-folder-line">
						{"Select the folder to open "}
						<Button className="select-folder" type="primary" onClick={() => {
							setIsLoading(true);
							resetCurrentError();
							return electronAPI.selectFolder().then((value) => {
								setInfo(value);
								setIsLoading(false);
							});
						}}>
							Open
						</Button>
					</Paragraph>
				}
				{
					info.folderPath &&
					<>
						<Paragraph>
							You selected <Text keyboard>{info.folderPath}</Text>.
						</Paragraph>
						<Button
							danger
							onClick={() => setInfo({})}
						>
							Retry
						</Button>
					</>
				}
			</>
		);
	}

	return (
		<AbstractStep content={<Content/>} title={"Select the folder"}/>
	);
}

SelectFolder.propTypes = {
	info: PropTypes.object.isRequired,
	setInfo: PropTypes.func.isRequired
};
