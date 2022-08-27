import { Button, Typography } from "antd";
import { WizardContext } from "helpers.js";
import { useElectronAPI } from "hooks.js";
import { useWizard } from "react-use-wizard";
import AbstractStep from "pages/import/steps/abstractStep.js";
import PropTypes from "prop-types";
import React, { useContext, useState } from "react";

let { Paragraph, Text } = Typography;

export default function SelectFolder({ initialFolder, onFolderChange }) {
	let [folder, setFolder] = useState(initialFolder);
	let [isLoading, setIsLoading] = useState(false);
	let electronAPI = useElectronAPI();
	let { handleStep } = useWizard();
	let { setCurrentError } = useContext(WizardContext);

	handleStep(() => {
		if (!folder) {
			throw new Error("You must select a folder");
		}
		onFolderChange(folder);
	});

	function Content() {
		if (isLoading) {
			return "LOADING";
		}

		return (<>
				{
					!folder &&
					<Paragraph className="select-folder-line">
						{"Select the folder to open "}
						<Button className="select-folder" type="primary" onClick={() => {
							setIsLoading(true);
							setCurrentError(null);
							return electronAPI.selectFolder().then((value) => {
								setFolder(value);
								setIsLoading(false);
							});
						}}>
							Open
						</Button>
					</Paragraph>
				}
				{
					folder &&
					<>
						<Paragraph>
							You selected <Text keyboard>{folder}</Text>.
						</Paragraph>
						<Button
							danger
							onClick={() => setFolder(null)}
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
	initialFolder: PropTypes.string,
	onFolderChange: PropTypes.func.isRequired
};
