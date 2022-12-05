import "pages/home/home.css";
import { defaultAppName } from "variables.js";
import { Layout, Spin } from "antd";
import { SearchForm } from "components/searchForm/searchForm.js";
import { useElectronAPI, useElectronAPIPromise } from "hooks.js";
import EntityCard from "components/entityCard/entityCard.js";
import NavigationActions from "components/navigationActions/navigationActions.js";
import PageHeader from "components/pageHeader/pageHeader.js";
import React, { useCallback, useEffect, useState } from "react";

const getAllAvailableKinds = (api) => api.getAllAvailableKinds();
const getAllAvailableTags = (api) => api.getAllAvailableTags();

export default function Home() {
	let [entities, setEntities] = useState(null);
	let [kinds, setKinds] = useState(null);
	let [tags, setTags] = useState(null);
	let [entitiesToken, setEntitiesToken] = useState(0);
	let electronAPI = useElectronAPI();
	let [filters, setFilters] = useState({});

	useEffect(() => {
		electronAPI.setTitle(defaultAppName);
	}, [electronAPI]);

	let getAllEntities = useCallback((api) => api.getAllEntities(filters), [filters]);

	useElectronAPIPromise(getAllEntities, setEntities, entitiesToken);
	useElectronAPIPromise(getAllAvailableKinds, setKinds, entitiesToken);
	useElectronAPIPromise(getAllAvailableTags, setTags, entitiesToken);

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
			<Layout>
				<Layout.Sider>
					<SearchForm kinds={kinds} tags={tags} onChange={setFilters}/>
				</Layout.Sider>
				<Layout.Content>
					<div className="entities">
						{entities.map((entity) => <EntityCard key={entity.id} entity={entity}/>)}
					</div>
				</Layout.Content>
			</Layout>
		</div>
	);
}
