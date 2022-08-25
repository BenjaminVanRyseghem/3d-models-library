import "pages/home/home.css";
import { defaultAppName } from "variables.js";
import { useElectronAPI, useElectronAPIPromise } from "hooks.js";
import EntityCard from "components/entityCard/entityCard.js";
import React, { useEffect, useState } from "react";

const getAllEntities = (api) => {
	return api.getAllEntities();
};

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
			<div className="entities">
				{entities.map((entity) => <EntityCard key={entity.id} entity={entity}/>)}
			</div>
		</div>
	);
}
