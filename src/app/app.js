import "./app.scss";
import PropTypes from "prop-types";
import React from "react";

class EntityCard extends React.Component {
	static propTypes = {
		entity: PropTypes.object
	};

	render() {
		let { entity } = this.props;
		return <div className="EntityCard">
			{entity.picture && <img alt="entity cover" src={`resource://${entity.path}/${entity.picture}`}/>}
			<div className="name">{this.props.entity.name}</div>
			{!!entity.children.length && <ul className="children">
				{entity.children.map((child) => <li key={child.path}><EntityCard entity={child}/></li>)}
			</ul>}
		</div>;
	}
}

export default class App extends React.Component {
	state = {
		entities: null
	};

	componentDidMount() {
		window.electronAPI.getAllEntities().then((entities) => {
			this.setState({ entities });
		});
	}

	render() {
		let { entities } = this.state;
		if (!entities) {
			return "loading";
		}

		return (<div className="App">
			<ul>
				{entities.map((entity) => <li key={entity.path}><EntityCard entity={entity}/></li>)}
			</ul>
		</div>);
	}
}
