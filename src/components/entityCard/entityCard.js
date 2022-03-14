import "./entityCard.scss";
import { useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import React from "react";

export default function EntityCard({ entity }) {
	let navigate = useNavigate();
	let location = useLocation();
	return <div className="entityCard" onClick={() => {
		navigate(`/entity/${entity.id}?from=${location.pathname}`);
	}}>
		<div className="image">
			{entity.picture &&
				<img alt="entity cover" src={`resource://${entity.path}/${entity.picture}`}/>
			}
		</div>
		<div className="content">
			<div className="name">{entity.name}</div>
		</div>
	</div>;
}

EntityCard.propTypes = {
	entity: PropTypes.object
};
