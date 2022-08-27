import "components/entityCard/entityCard.css";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import EntityPicture from "components/entityPicture/entityPicture.js";
import PropTypes from "prop-types";
import React from "react";

export default function EntityCard({ entity }) {
	let navigate = useNavigate();

	let description = entity.children.length
		? `${entity.children.length} children`
		: entity.tags?.join(", ");

	return (
		<Card
			key={entity.id}
			hoverable
			cover={<EntityPicture entity={entity}/>}
			style={{
				width: 240
			}}
			onClick={() => navigate(`/entity/${entity.id}`)}
		>
			<Card.Meta description={description} title={entity.name}/>
		</Card>
	);
}

EntityCard.propTypes = {
	entity: PropTypes.object
};
