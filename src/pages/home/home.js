import "pages/home/home.css";
import { Button, Layout, Spin } from "antd";
import { defaultAppName } from "variables.js";
import { useElectronAPI, useElectronAPIPromise } from "hooks.js";
import EntityCard from "components/entityCard/entityCard.js";
import NavigationActions from "components/navigationActions/navigationActions.js";
import PageHeader from "components/pageHeader/pageHeader.js";
import React, { useEffect, useState } from "react";

const getAllEntities = (api) => api.getAllEntities();

export default function Home() {
	let [entities, setEntities] = useState(null);
	let [entitiesToken, setEntitiesToken] = useState(0);
	let electronAPI = useElectronAPI();

	useEffect(() => {
		electronAPI.setTitle(defaultAppName);
	}, [electronAPI]);

	useElectronAPIPromise(getAllEntities, setEntities, entitiesToken);

	if (!entities) {
		return <Spin size="large"/>;
	}

	return (
		<div className="page home">
			<PageHeader
				noBack
				extra={[
					<NavigationActions key="actions" refresh={() => {
						setEntities(null);
						setEntitiesToken((token) => token + 1);
					}}/>
				]}
				title="All models"
			/>
			<Layout.Content>
				<div className="actions">
				</div>
				<div className="entities">
					{entities.map((entity) => <EntityCard key={entity.id} entity={entity}/>)}
				</div>
			</Layout.Content>
		</div>
	);
}
