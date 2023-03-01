import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/layout/App";
import "./index.css";
import { createBrowserHistory } from "history";
import HistoryRouter from "./app/components/HistoryRouter";
import { ApolloProvider } from "@apollo/client";
import { client } from "./app/api/agent";

export const browserHistory = createBrowserHistory();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<HistoryRouter history={browserHistory}>
				<App />
			</HistoryRouter>
		</ApolloProvider>
	</React.StrictMode>
);
