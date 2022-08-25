import "components/entityCard/entityCard.css";
import { useNavigate } from "react-router-dom";
import EntityPicture from "components/entityPicture/entityPicture.js";
import PropTypes from "prop-types";
import React from "react";

function Picture({ entity }) {
	if (!entity.cover) {
		return <div className="cover"/>;
	}

	return (
		<div className="cover">
			<EntityPicture entity={entity}/>
		</div>
	);
}

export class EntityCardContent extends React.Component {
	static propTypes = {
		entity: PropTypes.object,
		navigate: PropTypes.func.isRequired
	};

	render() {
		let { navigate, entity } = this.props;

		return (
			<div className="entityCard" onClick={() => {
				navigate(`/entity/${entity.id}`);
			}}>
				<Picture entity={this.props.entity}/>
				<div className="content">
					<div className="name">{entity.name}</div>
					<div className="children">{!!entity.children.length && `${entity.children.length} children`}</div>
					<Tags entity={this.props.entity}/>
				</div>
			</div>
		);
	}
}

function Tags({ entity }) {
	return (
		<div className="tags">
			{entity.tags?.map((tag) => <div key={tag} className="tag">{tag}</div>)}
		</div>
	);
}

export default function EntityCard({ entity }) {
	let navigate = useNavigate();
	return <EntityCardContent entity={entity} navigate={navigate}/>;
}

Picture.propTypes = {
	entity: PropTypes.object
};

Tags.propTypes = {
	entity: PropTypes.object
};

EntityCard.propTypes = {
	entity: PropTypes.object
};
