import "components/entityCard/entityCard.css";
import { useNavigate } from "react-router-dom";
import EntityPicture from "components/entityPicture/entityPicture.js";
import PropTypes from "prop-types";
import React from "react";

export class EntityCardContent extends React.Component {
	static propTypes = {
		entity: PropTypes.object,
		navigate: PropTypes.func.isRequired
	};

	renderPicture() {
		let { entity } = this.props;
		if (!entity.cover) {
			return <div className="cover"/>;
		}

		return (
			<div className="cover">
				<EntityPicture entity={entity}/>
			</div>
		);
	}

	renderTags() {
		let { entity } = this.props;

		return (
			<div className="tags">
				{entity.tags?.map((tag) => <div key={tag} className="tag">{tag}</div>)}
			</div>
		);
	}

	render() {
		let { navigate, entity } = this.props;

		return (
			<div className="entityCard" onClick={() => {
				navigate(`/entity/${entity.id}`);
			}}>
				{this.renderPicture()}
				<div className="content">
					<div className="name">{entity.name}</div>
					<div className="children">{!!entity.children.length && `${entity.children.length} children`}</div>
					{this.renderTags()}
				</div>
			</div>
		);
	}
}

export default function EntityCard({ entity }) {
	let navigate = useNavigate();
	return <EntityCardContent entity={entity} navigate={navigate}/>;
}

EntityCard.propTypes = {
	entity: PropTypes.object
};
