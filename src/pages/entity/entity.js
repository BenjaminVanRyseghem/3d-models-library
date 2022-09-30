import "pages/entity/entity.css";
import { Col, Descriptions, Layout, Row, Skeleton } from "antd";
import { defaultAppName } from "variables.js";
import { PictureOutlined } from "@ant-design/icons";
import { resolveEntityPicture } from "helpers.js";
import { useElectronAPI, useElectronAPIPromise } from "hooks.js";
import { useParams } from "react-router-dom";
import EntityCard from "components/entityCard/entityCard.js";
import EntityPicture from "components/entityPicture/entityPicture.js";
import ImagePreviewGroup from "components/imagePreviewGroup/imagePreviewGroup.js";
import PageHeader from "components/pageHeader/pageHeader.js";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";

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
			<InnerContent
				cover={<Skeleton.Image active className="cover-img empty"/>}
				info={<Skeleton active size="large"/>}
				title={"Loading the entity"}
			>
				<Skeleton.Node active className="empty card"/>
				<Skeleton.Node active className="empty card"/>
				<Skeleton.Node active className="empty card"/>
			</InnerContent>
		);
	}

	return (
		<InnerContent
			entity={entity}
		>
			{entity.children.map((child) => <Col key={child.id} span={6}>
				<EntityCard entity={child}/>
			</Col>)}
		</InnerContent>
	);
}

function InnerContent({
	entity,
	title = entity.name,
	cover = <EntityPicture full entity={entity}/>,
	info = <Info entity={entity}/>,
	children
}) {
	return (
		<div className="page entity">
			<PageHeader entity={entity} title={title}/>
			<Layout.Content>
				<div className="cover">
					{cover}
				</div>
				{info}
				<Row className="children" gutter={[16, 16]}>
					{children}
				</Row>
			</Layout.Content>
		</div>
	);
}

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
						<ImagePreviewGroup
							sources={
								entity.pictures.map((image) => resolveEntityPicture({
									entity,
									path: image
								}))
							}
							title={<PictureOutlined/>}
						/>
					</div>
				</Descriptions.Item>}
			</Descriptions>
		</div>
	);
}

Info.propTypes = {
	entity: PropTypes.object.isRequired
};

InnerContent.propTypes = {
	children: PropTypes.node,
	cover: PropTypes.node,
	entity: PropTypes.object,
	info: PropTypes.node,
	title: PropTypes.node
};
