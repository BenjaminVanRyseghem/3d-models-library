import { Alert } from "antd";
import { useWizard, Wizard } from "react-use-wizard";
import PropTypes from "prop-types";
import React, { useState } from "react";
import WizardFooter from "./wizardFooter.js";

export default {
	component: WizardFooter,
	title: "src/components/wizardFooter"
};

function LoadingStep({ children }) {
	let { isLoading, handleStep } = useWizard();
	let [error, setError] = useState();

	if (isLoading) {
		return "LOADING";
	}

	return (
		<>
			{React.cloneElement(children, {
				handleStep: (fn) => {
					handleStep(() => fn().catch((err) => {
						setError(err);
						throw err;
					}));
				}
			})}
			{error && <Alert banner message={error.message} type="error"/>}
		</>
	);
}
let shouldFail = true;
function Step1({ handleStep }) {
	handleStep(() => new Promise((resolve, reject) => {
		setTimeout(() => {
			if (shouldFail) {
				shouldFail = false;
				reject(new Error("Test!"));
			}
			resolve();
		}, 1000);
	}));

	return (
		"Foo"
	);
}

const template = (args) => <Wizard footer={<WizardFooter {...args} />}>
	<LoadingStep><Step1/></LoadingStep>
	<div>two</div>
	<div>three</div>
</Wizard>;

export const Shows = template.bind();

Shows.args = {};

LoadingStep.propTypes = {
	children: PropTypes.node
};
