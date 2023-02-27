import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/layout/App";
import "./index.css";
import { createBrowserHistory } from "history";
import HistoryRouter from "./app/components/HistoryRouter";

export const browserHistory = createBrowserHistory();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<HistoryRouter history={browserHistory}>
			<App />
		</HistoryRouter>
	</React.StrictMode>
);
