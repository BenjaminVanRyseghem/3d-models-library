import "./index.scss";
import "./dev.js";
import {
	BrowserRouter,
	Route,
	Routes
} from "react-router-dom";
import Entity from "pages/entity/entity.js";
import Home from "pages/home/home.js";
import Layout from "components/layout/layout.js";
import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={<Layout/>} path="/">
					<Route index element={<Home/>}/>
					<Route path="entity">
						<Route element={<Entity/>} path=":id"/>
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root")
);

/*
 * If you want to start measuring performance in your app, pass a function
 * to log results (for example: reportWebVitals(console.log))
 * or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
 */
reportWebVitals();
