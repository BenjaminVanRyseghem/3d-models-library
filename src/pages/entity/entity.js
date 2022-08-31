import "pages/entity/entity.css";
import { defaultAppName } from "variables.js";
import { Descriptions, Layout, Skeleton } from "antd";
import { PictureOutlined } from "@ant-design/icons";
import { resolveEntityPicture } from "helpers.js";
import { useElectronAPI, useElectronAPIPromise } from "hooks.js";
import { useParams } from "react-router-dom";
import EntityCard from "components/entityCard/entityCard.js";
import EntityPicture from "components/entityPicture/entityPicture.js";
import ImagePreview from "components/imagePreview/imagePreview.js";
import PageHeader from "components/pageHeader/pageHeader.js";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

function Info({ entity }) {
	return (
		<div className="entity-info">
			<Descriptions bordered column={2}>
				<Descriptions.Item label="Kind">{entity.kind}</Descriptions.Item>
				{entity.tags && entity.tags.length &&
					<Descriptions.Item label="Tags">{entity.tags.join(", ")}</Descriptions.Item>}
				{entity.types && <Descriptions.Item label="Types">{entity.types.join(", ")}</Descriptions.Item>}
				{entity.pictures && <Descriptions.Item label="Pictures" span={2}>
					<div className="pictures">
						{entity.pictures.map((image) => <ImagePreview
							key={image}
							src={resolveEntityPicture({
								entity,
								path: image
							})}
							title={<PictureOutlined/>}/>)}
					</div>
				</Descriptions.Item>}
			</Descriptions>
		</div>
	);
}

export default function Entity() {
	let params = useParams();
	let [entity, setEntity] = useState(null);
	let electronAPI = useElectronAPI();
	let getEntity = useCallback((api) => api.getEntity(params.id), [params.id]);

	useElectronAPIPromise(getEntity).then(setEntity);

	useEffect(() => {
		electronAPI.setTitle(entity?.name ?? defaultAppName);
	}, [electronAPI, entity]);

	if (!entity) {
		return (
			<div className="page entity">
				<PageHeader title="Loading the entity"/>
				<Layout.Content>
					<div className="cover">
						<Skeleton.Image active className="cover-img empty"/>
					</div>
					<Skeleton active size="large"/>
					<div className="children">
						<Skeleton.Node active className="empty card"/>
						<Skeleton.Node active className="empty card"/>
						<Skeleton.Node active className="empty card"/>
					</div>
				</Layout.Content>
			</div>
		);
	}

	return (
		<div className="page entity">
			<PageHeader title={entity.name}/>
			<Layout.Content>
				<div className="cover">
					<EntityPicture full entity={entity}/>
				</div>
				<Info entity={entity}/>
				<div className="children">
					{entity.children.map((child) => <EntityCard key={child.id} entity={child}/>)}
				</div>
			</Layout.Content>
		</div>
	);
}

Info.propTypes = {
	entity: PropTypes.object.isRequired
};

