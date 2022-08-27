import "./import.css";
import { importPageName } from "variables.js";
import { Layout } from "antd";
import { useElectronAPI } from "hooks.js";
import { Wizard } from "react-use-wizard";
import { WizardContext } from "helpers.js";
import Introduction from "./steps/introduction.js";
import PageHeader from "components/pageHeader/pageHeader.js";
import React, { useEffect, useState } from "react";
import SelectFolder from "pages/import/steps/selectFolder.js";
import WizardFooter from "components/wizardFooter/wizardFooter.js";

export default function Import() {
	let electronAPI = useElectronAPI();

	let [folder, setFolder] = useState();
	let [currentError, setCurrentError] = useState();

	useEffect(() => {
		electronAPI.setTitle(importPageName);
	}, [electronAPI]);

	return (
		<div className="page import">
			<PageHeader title="Import"/>
			<Layout.Content>
				<div className="import-wizard">
					<WizardContext.Provider value={{
						currentError,
						setCurrentError
					}}>
						<Wizard
							footer={<WizardFooter/>}
							wrapper={<div className="import-wizard-step"/>}
						>
							<Introduction/>
							<SelectFolder initialFolder={folder} onFolderChange={setFolder}/>
							<Introduction/>
							<Introduction/>
						</Wizard>
					</WizardContext.Provider>
				</div>
			</Layout.Content>
		</div>
	);
}
