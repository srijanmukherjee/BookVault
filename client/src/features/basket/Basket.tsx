import {
	Button,
	Container,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	useTheme,
} from "@mui/material";
import { useAppSelector } from "../../app/store";
import BasketTable from "./BasketTable";
import { useNavigate } from "react-router-dom";

function Basket() {
	const { status, basket } = useAppSelector((state) => state.basket);
	const navigate = useNavigate();
	const theme = useTheme();

	// Show some empty cart message
	if (!basket || basket.basketItems.length === 0) {
		return (
			<Container
				sx={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					flexDirection: "column",
					height: `92vh`,
					gap: 2,
				}}>
				<Typography variant="h2">Your cart is empty</Typography>
				<Button variant="outlined" onClick={() => navigate("/catalog")}>
					Browse books
				</Button>
			</Container>
		);
	}

	return (
		<Container maxWidth="xl" sx={{ my: 4 }}>
			<Typography variant="h3" mb={2}>
				Shopping Cart
			</Typography>
			<BasketTable />
		</Container>
	);
}

export default Basket;
