import "pages/home/home.css";
import { Button, Layout } from "antd";
import { defaultAppName } from "variables.js";
import { ImportOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { useElectronAPI, useElectronAPIPromise } from "hooks.js";
import EntityCard from "components/entityCard/entityCard.js";
import PageHeader from "components/pageHeader/pageHeader.js";
import React, { useEffect, useState } from "react";

const getAllEntities = (api) => api.getAllEntities();

export default function Home() {
	let [entities, setEntities] = useState(null);
	let electronAPI = useElectronAPI();

	useEffect(() => {
		electronAPI.setTitle(defaultAppName);
	}, [electronAPI]);

	useElectronAPIPromise(getAllEntities, setEntities);

	if (!entities) {
		return "loading";
	}

	return (
		<div className="page home">
			<PageHeader
				noBack
				extra={[<NavLink key="import" to="/import"><Button type="primary"><ImportOutlined/> Import</Button></NavLink>]}
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
