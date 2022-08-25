import "pages/home/home.css";
import { NavLink } from "react-router-dom";
import { defaultAppName } from "variables.js";
import { useElectronAPI, useElectronAPIPromise } from "hooks.js";
import EntityCard from "components/entityCard/entityCard.js";
import React, { useEffect, useState } from "react";

const getAllEntities = (api) => api.getAllEntities();

export default function Home() {
	let [entities, setEntities] = useState(null);
	let electronAPI = useElectronAPI();

	useEffect(() => {
		electronAPI.setTitle(defaultAppName);
	}, [electronAPI]);

	useElectronAPIPromise(getAllEntities).then(setEntities);

	if (!entities) {
		return "loading";
	}

	return (
		<div className="home">
			<h1>All models</h1>
			<div className="actions">
				<NavLink to="/import"><button className="import">Import</button></NavLink>
			</div>
			<div className="entities">
				{entities.map((entity) => <EntityCard key={entity.id} entity={entity}/>)}
			</div>
		</div>
	);
}
