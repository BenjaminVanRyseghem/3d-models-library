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
			<Button
				key="reload"
				icon={<ReloadOutlined/>}
				type="primary"
				onClick={() => {
					electronAPI.reloadEntitiesDB();
					refresh();
				}}
			>
				Refresh
			</Button>
			<NavLink key="import" to="/import">
				<Button icon={<ImportOutlined/>} type="primary">Import</Button></NavLink>
		</Space>
	);
}

NavigationActions.propTypes = {
	refresh: func
};
