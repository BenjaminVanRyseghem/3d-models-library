import "pages/entity/entity.css";
import { useNavigate, useParams } from "react-router-dom";
import EntityCard from "components/entityCard/entityCard.js";
import EntityPicture from "components/entityPicture/entityPicture.js";
import PropTypes from "prop-types";
import React from "react";

class EntityContent extends React.Component {
	static defaultProps = {};

	static propTypes = {
		electronAPI: PropTypes.object.isRequired,
		id: PropTypes.string.isRequired,
		navigate: PropTypes.func.isRequired
	};

	state = {
		entity: null
	};

	fetchEntity() {
		this.props.electronAPI.getEntity(this.props.id).then((entity) => {
			this.setState({ entity });
			this.props.electronAPI.setTitle(entity.name);
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.id !== this.props.id) {
			this.fetchEntity();
		}
	}

	componentDidMount() {
		this.fetchEntity();
	}

	renderInfo() {
		let { entity } = this.state;
		return (
			<div className="entity-info">
				<div className="kind">{entity.kind}</div>
				<div className="tags">Tags</div>
			</div>
		);
	}

	render() {
		let { entity } = this.state;

		if (!entity) {
			return "loading";
		}
		return (
			<div className="entity">
				<div className="cover">
					<EntityPicture entity={entity}/>
				</div>
				<div className="name">{entity.name}</div>
				{this.renderInfo()}
				<div className="children">
					{entity.children.map((child) => <EntityCard key={child.id} entity={child}/>)}
				</div>

				<div className="back" onClick={() => {
					this.props.navigate(-1);
				}}>
					Back
				</div>
			</div>
		);
	}
}

export default function Entity({ electronAPI }) {
	let params = useParams();
	let navigate = useNavigate();
	return <EntityContent electronAPI={electronAPI} id={params.id} navigate={navigate}/>;
}

Entity.propTypes = {
	electronAPI: PropTypes.object.isRequired
};
