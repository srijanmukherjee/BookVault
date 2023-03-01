import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/layout/App";
import "./index.css";
import { createBrowserHistory } from "history";
import HistoryRouter from "./app/components/HistoryRouter";
import { ApolloProvider } from "@apollo/client";
import { client } from "./app/api/agent";
import { Provider } from "react-redux";
import { store } from "./app/store";

export const browserHistory = createBrowserHistory();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<ApolloProvider client={client}>
			<Provider store={store}>
				<HistoryRouter history={browserHistory}>
					<App />
				</HistoryRouter>
			</Provider>
		</ApolloProvider>
	</React.StrictMode>
);
