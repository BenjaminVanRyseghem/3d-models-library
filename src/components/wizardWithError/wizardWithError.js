import { Wizard } from "react-use-wizard";
import React, { useContext, useState } from "react";

const WizardWithErrorContext = React.createContext({
	currentError: null,
	setCurrentError: () => {},
	resetCurrentError: () => {}
});

export default function WizardWithError(props) {
	let [currentError, setCurrentError] = useState(null);

	return (
		<WizardWithErrorContext.Provider value={{
			currentError,
			setCurrentError,
			resetCurrentError: () => setCurrentError(null)
		}}>
			<Wizard {...props}/>
		</WizardWithErrorContext.Provider>
	);
}

export function useWizardError() {
	return useContext(WizardWithErrorContext);
}
