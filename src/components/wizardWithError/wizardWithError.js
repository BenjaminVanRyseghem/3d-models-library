import { Wizard } from "react-use-wizard";
import React, { useContext, useState } from "react";

const WizardWithErrorContext = React.createContext({
	currentError: null,
	setCurrentError: () => {},
	resetCurrentError: () => {},
	isStepLoading: false,
	setIsStepLoading: () => {}
});

export default function WizardWithError(props) {
	let [currentError, setCurrentError] = useState(null);
	let [isStepLoading, setIsStepLoading] = useState(false);

	return (
		<WizardWithErrorContext.Provider value={{
			currentError,
			setCurrentError,
			resetCurrentError: () => setCurrentError(null),
			isStepLoading,
			setIsStepLoading
		}}>
			<Wizard {...props}/>
		</WizardWithErrorContext.Provider>
	);
}

export function useWizardError() {
	return useContext(WizardWithErrorContext);
}
