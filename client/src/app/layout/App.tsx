import { useEffect, useState } from "react";
import "./App.css";
import Header from "../components/Header";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

const THEME_KEY = "theme";

function App() {
	const [darkTheme, setDarkTheme] = useState(
		localStorage.getItem(THEME_KEY) === "dark"
	);

	const theme = createTheme({
		palette: {
			mode: darkTheme ? "dark" : "light",
		},
	});

	useEffect(() => {
		localStorage.setItem(THEME_KEY, theme.palette.mode);
	}, [theme]);

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Header
				theme={theme.palette.mode}
				onThemeToggle={() => setDarkTheme((theme) => !theme)}
			/>
		</ThemeProvider>
	);
}

export default App;
