import { Button, Spin, Typography } from "antd";
import { useElectronAPI } from "hooks.js";
import { useWizard } from "react-use-wizard";
import { useWizardError } from "components/wizardWithError/wizardWithError.js";
import AbstractStep from "pages/import/steps/abstractStep.js";
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";

let { Paragraph, Text } = Typography;

export default function SelectFolder({ info, setInfo }) {
	let electronAPI = useElectronAPI();
	let { handleStep } = useWizard();
	let { resetCurrentError, isStepLoading, setIsStepLoading } = useWizardError();

	handleStep(() => {
		if (!info.folderPath) {
			throw new Error("You must select a folder");
		}
	});

	function Content() {
		if (isStepLoading) {
			return <Spin size="large"/>;
		}

		return (<>
				{
					!info.folderPath &&
					<Paragraph className="select-folder-line">
						{"Select the folder to open "}
						<Button className="select-folder" type="primary" onClick={() => {
							setIsStepLoading(true);
							resetCurrentError();
							return electronAPI.selectFolder().then((value) => {
								setInfo(value);
								setIsStepLoading(false);
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
							onClick={() => setInfo(null)}
						>
							Retry
						</Button>
					</>
				}
			</>
		);
	}

	return (
		<AbstractStep className={classnames({
			"select-folder": true,
			loading: isStepLoading
		})} content={
			<Content/>} title={"Select the folder"}/>
	);
}

SelectFolder.propTypes = {
	info: PropTypes.object.isRequired,
	setInfo: PropTypes.func.isRequired
};
