import { BrowserHistory } from "history";
import { useLayoutEffect, useState } from "react";
import { Router } from "react-router-dom";

interface Props {
	basename?: string;
	children: React.ReactNode;
	history: BrowserHistory;
}

export default function HistoryRouter({ basename, children, history }: Props) {
	const [state, setState] = useState({
		action: history.action,
		location: history.location,
	});

	useLayoutEffect(() => history.listen(setState), [history]);

	return (
		<Router
			basename={basename}
			location={state.location}
			navigator={history}
			navigationType={state.action}>
			{children}
		</Router>
	);
}
