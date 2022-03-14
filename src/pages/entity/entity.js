import "./entity.scss";
import { useNavigate, useParams } from "react-router-dom";
import EntityCard from "components/entityCard/entityCard.js";
import PropTypes from "prop-types";
import React from "react";

class EntityContent extends React.Component {
	static defaultProps = {};

	static propTypes = {
		id: PropTypes.string.isRequired,
		navigate: PropTypes.func.isRequired
	};

	state = {
		entity: null
	};

	fetchEntity() {
		window.electronAPI.getEntity(this.props.id).then((entity) => {
			this.setState({ entity });
			window.electronAPI.setTitle(entity.name);
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

	render() {
		let { entity } = this.state;

		if (!entity) {
			return "loading";
		}
		return (
			<div className="entity">
				<div className="image">
					{entity.picture && <img alt="entity cover" src={`resource://${entity.path}/${entity.picture}`}/>}
				</div>
				<div className="name">{entity.name}</div>

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

export default function Entity() {
	let params = useParams();
	let navigate = useNavigate();
	return <EntityContent id={params.id} navigate={navigate}/>;
}
