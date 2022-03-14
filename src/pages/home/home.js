import "./home.scss";
import EntityCard from "components/entityCard/entityCard.js";
import React from "react";

export default class Home extends React.Component {
	state = {
		entities: null
	};

	componentDidMount() {
		window.electronAPI.setTitle("3d Models Library");
		window.electronAPI.getAllEntities().then((entities) => {
			this.setState({ entities });
		});
	}

	render() {
		let { entities } = this.state;
		if (!entities) {
			return "loading";
		}

		return (<div className="home">
			{entities.map((entity) => <EntityCard key={entity.id} entity={entity}/>)}
		</div>);
	}
}
