import "pages/entity/entity.css";
import { defaultAppName } from "variables.js";
import { useElectronAPI, useElectronAPIPromise } from "hooks.js";
import { useNavigate, useParams } from "react-router-dom";
import EntityCard from "components/entityCard/entityCard.js";
import EntityPicture from "components/entityPicture/entityPicture.js";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

function Info({ entity }) {
	return (
		<div className="entity-info">
			<div className="kind">{entity.kind}</div>
			<div className="tags">Tags</div>
		</div>
	);
}

export default function Entity() {
	let params = useParams();
	let navigate = useNavigate();
	let [entity, setEntity] = useState(null);
	let electronAPI = useElectronAPI();
	let getEntity = useCallback((api) => api.getEntity(params.id), [params.id]);

	useElectronAPIPromise(getEntity).then(setEntity);

	useEffect(() => {
		electronAPI.setTitle(entity?.name ?? defaultAppName);
	}, [electronAPI, entity]);

	if (!entity) {
		return "loading";
	}

	return (
		<div className="entity">
			<div className="cover">
				<EntityPicture entity={entity}/>
			</div>
			<div className="name">{entity.name}</div>
			<Info entity={entity}/>
			<div className="children">
				{entity.children.map((child) => <EntityCard key={child.id} entity={child}/>)}
			</div>

			<div className="back" onClick={() => {
				navigate(-1);
			}}>
				Back
			</div>
		</div>
	);
}

Info.propTypes = {
	entity: PropTypes.object.isRequired
};
