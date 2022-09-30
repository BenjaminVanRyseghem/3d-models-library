import "./wizardFooter.css";
import { Button, message, Steps } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useWizard } from "react-use-wizard";
import { useWizardError } from "components/wizardWithError/wizardWithError.js";
import classnames from "classnames";
import PropTypes from "prop-types";
import React from "react";

function range(size) {
	return Array.from({ length: size }, (_, index) => index);
}

function computeStepRangeFirstIndex({ maxVisibleSteps, activeStep, stepCount }) {
	let floor = Math.floor(maxVisibleSteps / 2);
	if (activeStep < floor) {
		return 0;
	}
	if (activeStep >= stepCount - floor) {
		return stepCount - maxVisibleSteps;
	}

	return activeStep - floor;
}

function Roadmap({ activeStep, stepCount, isLoading, isError = false, maxVisibleSteps = -1 }) {
	if (maxVisibleSteps > 0 && stepCount > maxVisibleSteps) {
		let stepsRange = range(maxVisibleSteps);
		let initial = computeStepRangeFirstIndex({
			activeStep,
			stepCount,
			maxVisibleSteps
		});
		let activeIndex = activeStep - initial;

		return (
			<div className="Roadmap">
				<Steps current={activeStep}
					initial={initial}
					size="sm"
					status={isError ? "error" : "process"}
				>
					{stepsRange.map((index) => {
						let icon = isLoading && index === activeIndex ? <LoadingOutlined/> : undefined;
						let status = index < activeIndex ? "finish" : undefined;
						return <Steps.Step key={index} icon={icon} status={status}/>;
					})}
				</Steps>
			</div>
		);
	}

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

export default function WizardFooter({ onDone = () => Promise.resolve() }) {
	let {
		isLoading,
		isLastStep,
		isFirstStep,
		activeStep,
		stepCount,
		previousStep,
		nextStep
	} = useWizard();
	let { currentError, setCurrentError, resetCurrentError, isStepLoading, setIsStepLoading } = useWizardError();

	async function handleOnNext() {
		resetCurrentError();
		if (isLastStep) {
			setIsStepLoading(true);
			onDone().finally(() => {
				setIsStepLoading(false);
			});
		}

		try {
			await nextStep();
		} catch (err) {
			message.error(err.message);
			setCurrentError(err);
		}
	}

	return <div className="WizardFooter">
		<Button className={classnames(["fixed-width", { hidden: isFirstStep }])} disabled={isLoading || isStepLoading} type="primary" onClick={() => {
			resetCurrentError();
			previousStep();
		}}>Previous</Button>
		<Roadmap
			activeStep={activeStep}
			isError={!!currentError}
			isLoading={isLoading}
			maxVisibleSteps={5}
			stepCount={stepCount}
		/>
		<Button className="fixed-width" danger={!!currentError} loading={isLoading || isStepLoading} type="primary" onClick={handleOnNext}>{isLastStep ? "Done" : "Next"}</Button>
	</div>;
}

WizardFooter.propTypes = {
	onDone: PropTypes.func
};

Roadmap.propTypes = {
	activeStep: PropTypes.number.isRequired,
	isError: PropTypes.bool,
	isLoading: PropTypes.bool.isRequired,
	maxVisibleSteps: PropTypes.number,
	stepCount: PropTypes.number.isRequired
};
