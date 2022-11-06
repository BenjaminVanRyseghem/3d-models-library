import "./dev.js";
import "antd/dist/antd.css";
import "index.css";
import {
	BrowserRouter,
	Route,
	Routes
} from "react-router-dom";
import Entity from "pages/entity/entity.js";
import Home from "pages/home/home.js";
import Import from "pages/import/import.js";
import Layout from "components/layout/layout.js";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<BrowserRouter>
	<Routes>
		<Route element={<Layout/>} path="/">
			<Route index element={<Home/>}/>
			<Route index element={<Import/>} path="import"/>
			<Route path="entity">
				<Route element={<Entity/>} path=":id"/>
			</Route>
		</Route>
	</Routes>
</BrowserRouter>);

/*
 * If you want to start measuring performance in your app, pass a function
 * to log results (for example: reportWebVitals(console.log))
 * or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
 */
reportWebVitals();
