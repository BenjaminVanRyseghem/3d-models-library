import "./entityCard.scss";
import PropTypes from "prop-types";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function EntityCard({ entity }) {
	let navigate = useNavigate();
	return <div className="entityCard" onClick={() => {
		navigate(`/entity/${entity.id}`);
	}}>
		<div className="image">
			{entity.picture &&
				<img alt="entity cover" src={`resource://${entity.path}/${entity.picture}`}/>
			}
		</div>
		<div className="content">
			<div className="name">{entity.name}</div>
			<div className="tags">
				{entity.tags.map((tag) => <div key={tag} className="tag">{tag}</div>)}
			</div>
			<div className="children">{!!entity.children.length && `${entity.children.length} children`}</div>
		</div>
	</div>;
}

EntityCard.propTypes = {
	entity: PropTypes.object
};
