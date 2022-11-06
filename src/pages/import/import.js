import "./import.css";
import { importPageName } from "variables.js";
import { Layout } from "antd";
import { useElectronAPI, useElectronAPIPromise } from "hooks.js";
import { useNavigate } from "react-router-dom";
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
import SelectPreview from "pages/import/steps/selectPreview.js";
import Summary from "./steps/summary.js";
import WizardFooter from "components/wizardFooter/wizardFooter.js";
import WizardWithError from "components/wizardWithError/wizardWithError.js";

const getAllAvailableTags = (api) => api.getAllAvailableTags();

const pathSep = "/"; // todo: fix it for windows
const supportedRegex = /(?<!un)(?<!not )supported/i;
const unsupportedRegex = /unsupported/i;

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

export default function Import() {
	let electronAPI = useElectronAPI();
	let navigate = useNavigate();
	let [info, setInfo] = useState(initialInfoState);
	let [allAvailableTags, setAllAvailableTags] = useState([]);

	useElectronAPIPromise(getAllAvailableTags, setAllAvailableTags);

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

			newInfoValue.types ??= [];
			newInfoValue.types.push(...extractGuessableTypes(newInfoValue));

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
						footer={<WizardFooter onDone={() => electronAPI.writeEntityFile({
							answers: info,
							folderPath: info.folderPath,
							pictures: info.pictures.map((each) => ({ name: each }))
						}).then(({ id }) => {
							navigate(`/entity/${id}`);
						})}/>}
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
						{!info.pictures?.length && info.models?.length &&
							<SelectPreview
								setPreview={handleChange("preview")}
								stlFiles={info.models.map((fileName) => ({
									label: fileName.name,
									path: `${info.folderPath}${pathSep}${fileName.name}`
								}))}
							/>
						}
						<ChooseName name={info.name} setName={handleChange("name")}/>
						<ChooseKind kind={info.kind} setKind={handleChange("kind")}/>
						<ChooseTags allAvailableTags={allAvailableTags} setTags={handleChange("tags")} tags={info.tags}/>
						<ChooseTypes setTypes={handleChange("types")} types={info.types}/>
						<Summary info={info}/>
					</WizardWithError>
				</div>
			</Layout.Content>
		</div>
	);
}

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

function extractGuessableTypes({ models, folderPath }) {
	if (!models?.length) {
		return isSupported({ name: folderPath }) ? ["supported"] : [];
	}
	let result = new Set();
	models.forEach((model) => {
		if (isLys(model)) {
			result.add("lys");
		}

		if (isSupported(model)) {
			result.add("supported");
		}

		if (isUnsupported(model)) {
			result.add("unsupported");
		}
	});

	return Array.from(result);
}

function isLys({ name }) {
	return name.endsWith(".lys");
}

function isSupported({ name }) {
	return name.match(supportedRegex);
}

function isUnsupported({ name }) {
	return name.match(unsupportedRegex);
}
