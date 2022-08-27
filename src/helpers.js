import React from "react";

export function resolveEntityPicture({ entity, path = "" }) {
	return entity.exported ? path : `resource://${entity.path}/${path}`;
}

export const WizardContext = React.createContext({
	currentError: null,
	setCurrentError: () => {}
});
