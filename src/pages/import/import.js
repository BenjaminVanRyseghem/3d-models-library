import { Button } from "antd";
import { importPageName } from "variables.js";
import { useElectronAPI } from "hooks.js";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

export default function Import() {
	let electronAPI = useElectronAPI();
	let [folder, setFolder] = useState();

	let navigate = useNavigate();

	useEffect(() => {
		electronAPI.setTitle(importPageName);
	}, [electronAPI]);

	return (
		<div className="import">
			<h1>Import</h1>
			<button className="select-folder" onClick={() => electronAPI.selectFolder().then(setFolder)}>Select folder</button>
			{folder && <div className="folder-name">{folder}</div>}
			<Button type="primary" onClick={() => navigate(-1)}>Back</Button>
			<div className="back" onClick={() => {
				navigate(-1);
			}}>
				Back
			</div>
		</div>
	);
}
