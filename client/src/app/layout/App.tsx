import { useEffect, useState } from "react";
import "./App.css";
import Header from "../components/Header";
import {
	Box,
	CssBaseline,
	ThemeProvider,
	Typography,
	createTheme,
} from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Catalog from "../../features/catalog/Catalog";
import ProductDetail from "../../features/product/ProductDetail";

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
			<Box>
				<Routes>
					<Route
						path="/"
						element={
							<Typography height="1000vh" variant="h1">
								Home page
							</Typography>
						}
					/>
					<Route path="/catalog" element={<Catalog />} />
					<Route path="/product/:slug" element={<ProductDetail />} />
				</Routes>
			</Box>
		</ThemeProvider>
	);
}

export default App;
