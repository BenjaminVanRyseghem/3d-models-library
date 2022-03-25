import "pages/home/home.css";
import EntityCard from "components/entityCard/entityCard.js";
import PropTypes from "prop-types";
import React from "react";

export default class Home extends React.Component {
	static propTypes = {
		electronAPI: PropTypes.object.isRequired
	};

	state = {
		entities: null
	};

	componentDidMount() {
		this.props.electronAPI.setTitle("3d Models Library");
		this.props.electronAPI.getAllEntities().then((entities) => {
			this.setState({ entities });
		});
	}

	render() {
		let { entities } = this.state;
		if (!entities) {
			return "loading";
		}

		return (<div className="home">
			<div className="entities">
				{entities.map((entity) => <EntityCard key={entity.id} entity={entity}/>)}
			</div>
		</div>);
	}
}
