import "./wizardFooter.css";
import { Button, message, Steps } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useWizard } from "react-use-wizard";
import { WizardContext } from "helpers.js";
import classnames from "classnames";
import PropTypes from "prop-types";
import React, { useContext } from "react";

function range(size) {
	return Array.from({ length: size }, (_, index) => index);
}

function Roadmap({ activeStep, stepCount, isLoading, isError = false }) {
	let stepsRange = range(stepCount);

	return (
		<div className="Roadmap">
			<Steps current={activeStep} size="sm" status={isError ? "error" : "process"}>
				{stepsRange.map((index) => {
					let icon = isLoading && index === activeStep ? <LoadingOutlined/> : undefined;
					let status = index < activeStep ? "finish" : undefined;
					return <Steps.Step key={index} icon={icon} status={status}/>;
				})}
			</Steps>
		</div>
	);
}

export default function WizardFooter() {
	let {
		isLoading,
		isLastStep,
		isFirstStep,
		activeStep,
		stepCount,
		previousStep,
		nextStep
	} = useWizard();
	let { currentError, setCurrentError } = useContext(WizardContext);

	async function handleOnNext() {
		setCurrentError(null);
		try {
			await nextStep();
		} catch (err) {
			message.error(err.message);
			setCurrentError(err);
		}
	}

	return <div className="WizardFooter">
		<Button className={classnames(["fixed-width", { hidden: isFirstStep }])} type="primary" onClick={() => previousStep()}>Previous</Button>
		<Roadmap
			activeStep={activeStep}
			isError={!!currentError}
			isLoading={isLoading}
			stepCount={stepCount}
		/>
		<Button className="fixed-width" danger={!!currentError} type="primary" onClick={handleOnNext}>{isLastStep ? "Done" : "Next"}</Button>
	</div>;
}

Roadmap.propTypes = {
	activeStep: PropTypes.number.isRequired,
	isError: PropTypes.bool,
	isLoading: PropTypes.bool.isRequired,
	stepCount: PropTypes.number.isRequired
};
