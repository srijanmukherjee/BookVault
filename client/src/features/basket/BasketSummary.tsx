import {
	Box,
	Button,
	Container,
	List,
	ListItem,
	ListItemText,
	Paper,
	Typography,
	useTheme,
} from "@mui/material";
import { useAppSelector } from "../../app/store";

function BasketSummary() {
	const theme = useTheme();
	const { basket } = useAppSelector((state) => state.basket);
	const totalWithoutDiscount =
		basket?.basketItems.reduce(
			(value, basketItem) =>
				value + basketItem.quantity * basketItem.product?.price!,
			0
		) ?? 0;
	const discount =
		basket?.basketItems.reduce(
			(value, basketItem) =>
				value +
				(basketItem.quantity *
					basketItem.product?.price! *
					basketItem.product?.discount!) /
					100,
			0
		) ?? 0;

	const total = totalWithoutDiscount - discount;
	const delivery = total > 50000 ? 0 : 3000;

	return (
		<Box component={Paper} p={2} elevation={10}>
			<Typography variant="h5">Summary</Typography>
			<List sx={{ width: "100%", maxWidth: "min(100%, 100vw)" }}>
				<ListItem sx={{ display: "flex" }}>
					<ListItemText sx={{ flex: 1 }}>Total</ListItemText>
					<ListItemText sx={{ flex: 2 }}>
						Rs. {(totalWithoutDiscount / 100).toFixed(2)}
					</ListItemText>
				</ListItem>
				<ListItem sx={{ display: "flex" }}>
					<ListItemText sx={{ flex: 1 }}>Discount</ListItemText>
					<ListItemText sx={{ flex: 2 }}>
						<Typography>
							Rs. {(discount / 100).toFixed(2)}
						</Typography>
					</ListItemText>
				</ListItem>
				<ListItem sx={{ display: "flex" }}>
					<ListItemText sx={{ flex: 1 }}>Delivery</ListItemText>
					<ListItemText sx={{ flex: 2 }}>
						Rs. {(delivery / 100).toFixed(2)}
					</ListItemText>
				</ListItem>
				<ListItem
					sx={{
						display: "flex",
						borderTop: "1px solid #333",
						borderColor:
							theme.palette.mode === "dark" ? "#333" : "#eee",
					}}>
					<ListItemText sx={{ flex: 1 }}>
						<Typography
							fontSize="large"
							fontWeight="bold"
							color="primary.main">
							Total
						</Typography>
					</ListItemText>
					<ListItemText sx={{ flex: 2 }}>
						<Typography fontSize="medium">
							Rs. {((total + delivery) / 100).toFixed(2)}
						</Typography>
					</ListItemText>
				</ListItem>
			</List>
			<Typography variant="caption" color="text.secondary">
				<b>Note:</b> Delivery charges are subjected to change depending
				on your location and courier policies
			</Typography>
			<Button variant="contained" fullWidth sx={{ mt: 2 }}>
				Continue
			</Button>
		</Box>
	);
}

export default BasketSummary;
