import { useEffect, useMemo, useState } from "react";

export function useElectronAPI() {
	return window.electronAPI;
}

export function useElectronAPIPromise(fn) {
	let { electronAPI } = window;

	let promise = useMemo(() => fn(electronAPI), [fn, electronAPI]);
	let [result, setResult] = useState(new Promise(() => {}));

	useEffect(() => {
		let isCancelled = false;

		promise.then((data) => {
			if (isCancelled) {
				return;
			}
			setResult(Promise.resolve(data));
		});

		return () => {
			isCancelled = true;
		};
	}, [promise, setResult]);

	return result;
}
