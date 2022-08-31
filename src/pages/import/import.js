import "./import.css";
import { importPageName } from "variables.js";
import { Layout } from "antd";
import { useElectronAPI } from "hooks.js";
import ChooseCover from "./steps/chooseCover.js";
import ChooseKind from "./steps/chooseKind.js";
import ChooseName from "./steps/chooseName.js";
import ChooseTags from "./steps/chooseTags.js";
import ChooseTypes from "./steps/chooseTypes.js";
import Introduction from "./steps/introduction.js";
import NoArchives from "./steps/noArchives.js";
import NoModels from "./steps/noModels.js";
import PageHeader from "components/pageHeader/pageHeader.js";
import React, { useEffect, useState } from "react";
import SelectFolder from "./steps/selectFolder.js";
import Summary from "./steps/summary.js";
import WizardFooter from "components/wizardFooter/wizardFooter.js";
import WizardWithError from "components/wizardWithError/wizardWithError.js";

const pathSep = "/"; // todo: fix it for windows

const initialInfoState = {
	archives: [],
	pictures: [],
	folderPath: "",
	models: "",
	name: "",
	confirmNoModel: false,
	createArchive: false,
	cover: undefined,
	kind: undefined,
	tags: [],
	types: []
};

function extractNameFromFolderPath(folderPath) {
	if (!folderPath) {
		return "";
	}

	let pathToSlice = folderPath;
	if (pathToSlice.at(-1) === pathSep) {
		pathToSlice = pathToSlice.slice(0, -1);
	}

	return pathToSlice.substring(pathToSlice.lastIndexOf(pathSep) + 1);
}

export default function Import() {
	let electronAPI = useElectronAPI();
	let [info, setInfo] = useState(initialInfoState);

	useEffect(() => {
		electronAPI.setTitle(importPageName);
	}, [electronAPI]);

	function handleChange(key) {
		return (value) => setInfo((previousValue) => ({
			...previousValue,
			[key]: value
		}));
	}

	function setFolderInfo(newInfoValue) {
		setInfo((previousValue) => {
			if (!newInfoValue) {
				return initialInfoState;
			}

			return {
				...previousValue,
				...newInfoValue,
				confirmNoModel: !!newInfoValue?.archives?.length,
				cover: newInfoValue?.pictures?.[0],
				name: extractNameFromFolderPath(newInfoValue?.folderPath)
			};
		});
	}

	return (
		<div className="page import">
			<PageHeader title="Import"/>
			<Layout.Content>
				<div className="import-wizard">
					<WizardWithError
						footer={<WizardFooter onDone={() => {
							console.dir(info);
						}}/>}
						wrapper={<div className="import-wizard-step"/>}
					>
						<Introduction/>
						<SelectFolder info={info} setInfo={setFolderInfo}/>
						{!info.models?.length && <NoModels
							confirmNoModel={info.confirmNoModel}
							setConfirmNoModel={handleChange("confirmNoModel")}
						/>}
						{!info.archives?.length && <NoArchives
							createArchive={info.createArchive}
							setCreateArchive={handleChange("createArchive")}
						/>}
						{!!info.pictures?.length &&
							<ChooseCover
								cover={info.cover}
								pictures={info.pictures}
								setCover={handleChange("cover")}
							/>}
						<ChooseName name={info.name} setName={handleChange("name")}/>
						<ChooseKind kind={info.kind} setKind={handleChange("kind")}/>
						<ChooseTags setTags={handleChange("tags")} tags={info.tags}/>
						<ChooseTypes setTypes={handleChange("types")} types={info.types}/>
						<Summary info={info}/>
					</WizardWithError>
				</div>
			</Layout.Content>
		</div>
	);
}
