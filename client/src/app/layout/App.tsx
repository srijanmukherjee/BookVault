import { useEffect, useLayoutEffect, useState } from "react";
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
import { fetchBasket } from "../../features/basket/basketSlice";
import { useAppDispatch } from "../store";
import Basket from "../../features/basket/Basket";
import Login from "../../features/account/Login";
import Register from "../../features/account/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchCurrentUser } from "../../features/account/accountSlice";

const THEME_KEY = "theme";

function App() {
	const dispatch = useAppDispatch();
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

	useEffect(() => {
		dispatch(fetchBasket());
	}, [dispatch]);

	useLayoutEffect(() => {
		dispatch(fetchCurrentUser());
	}, [dispatch]);

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
					<Route path="/cart" element={<Basket />} />
					<Route path="/account/login" element={<Login />} />
					<Route path="/account/register" element={<Register />} />
				</Routes>
			</Box>
			<ToastContainer position="bottom-right" theme="colored" />
		</ThemeProvider>
	);
}

export default App;
