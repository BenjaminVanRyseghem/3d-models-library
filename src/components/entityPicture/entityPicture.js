import PropTypes from "prop-types";
import React from "react";

export default function EntityPicture({ entity }) {
	return entity.exported
		? <img alt="entity cover" src={entity.cover}/>
		: <img alt="entity cover" src={`resource://${entity.path}/${entity.cover}`}/>;
}

EntityPicture.propTypes = {
	entity: PropTypes.object.isRequired
};
