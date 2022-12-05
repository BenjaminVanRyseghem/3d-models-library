import { Button, Space } from "antd";
import { func } from "prop-types";
import { ImportOutlined, ReloadOutlined } from "@ant-design/icons";
import { NavLink } from "react-router-dom";
import { useElectronAPI } from "hooks.js";
import React from "react";

export default function NavigationActions({ refresh = () => {} }) {
	let electronAPI = useElectronAPI();

	return (
		<Space>
			<NavLink key="import" to="/import">
				<Button icon={<ImportOutlined/>}>Import</Button>
			</NavLink>
			<Button
				key="reload"
				icon={<ReloadOutlined/>}
				onClick={() => {
					electronAPI.reloadEntitiesDB();
					refresh();
				}}
			>
				Refresh
			</Button>
		</Space>
	);
}

NavigationActions.propTypes = {
	refresh: func
};
