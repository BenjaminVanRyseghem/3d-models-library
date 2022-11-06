import { useCallback, useEffect, useMemo, useState } from "react";

export function useElectronAPI() {
	return window.electronAPI;
}

export function useElectronAPIPromiseOld(fn) { // I would like to understand why it fails
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

export function useElectronAPIPromise(fn, cb) {
	let { electronAPI } = window;

	useEffect(() => {
		let isCancelled = false;

		fn(electronAPI).then((data) => {
			if (isCancelled) {
				return;
			}
			cb(data);
		});

		return () => {
			isCancelled = true;
		};
	}, [fn, cb, electronAPI]);
}
