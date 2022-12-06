import "components/entityCard/entityCard.css";
import { Badge, Card } from "antd";
import { useNavigate } from "react-router-dom";
import EntityPicture from "components/entityPicture/entityPicture.js";
import PropTypes from "prop-types";
import React from "react";

export default function EntityCard({ entity }) {
	let navigate = useNavigate();

	let card = (
		<Card
			key={entity.id}
			hoverable
			cover={<EntityPicture entity={entity}/>}
			style={{
				width: 240
			}}
			onClick={() => navigate(`/entity/${entity.id}`)}
		>
			<Card.Meta
				description={entity.tags?.join(", ")}
				title={entity.name}
			/>
		</Card>
	);

	return entity.children.length
		? <Badge.Ribbon text={entity.children.length}>{card}</Badge.Ribbon>
		: card;
}

EntityCard.propTypes = {
	entity: PropTypes.object
};
