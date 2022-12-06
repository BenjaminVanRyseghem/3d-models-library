import "components/layout/layout.css";
import { Outlet } from "react-router-dom";
import React from "react";

export default function Layout() {
	return (
		<div className="layout">
			<Outlet/>
		</div>
	);
}
