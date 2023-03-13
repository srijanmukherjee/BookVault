import {
	TableRow,
	TableCell,
	IconButton,
	Box,
	Typography,
	useTheme,
} from "@mui/material";
import { BasketItem as BasketItemType } from "../../app/models/basket";
import ProductCartButton from "../../app/components/ProductCartButton";
import { Add, Close, Remove } from "@mui/icons-material";
import Image from "mui-image";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { addBasketItem, removeBasketItem } from "./basketSlice";

interface Props {
	item: BasketItemType;
}

function BasketItem({ item }: Props) {
	const dispatch = useAppDispatch();
	const { status, context } = useAppSelector((state) => state.basket);
	const theme = useTheme();
	const update = (change: number) => {
		return () => {
			dispatch(
				addBasketItem({
					productId: item.product!.id!,
					quantity: change,
				})
			);
		};
	};
	return (
		<TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
			<TableCell component="th" scope="row">
				<Box display="flex" alignItems="center" gap="10px">
					<Box sx={{ borderRadius: "5px", overflow: "hidden" }}>
						<Image
							src={item.product!.book!.image!}
							alt={item.product!.book!.name}
							width="50px"
						/>
					</Box>
					<Typography
						fontSize="large"
						sx={{
							color: "text.primary",
							textDecoration: "none",
							"&:hover": {
								color: "warning.light",
							},
						}}
						component={Link}
						to={`/product/${item.product?.slug!}`}>
						{item.product?.book!.name}
					</Typography>
				</Box>
			</TableCell>
			<TableCell align="right">
				<Box
					display="inline-flex"
					alignItems="center"
					gap="10px"
					padding="0.2em"
					border="1px solid"
					borderColor={
						theme.palette.mode === "dark" ? "#333" : "#ddd"
					}
					borderRadius="9999px">
					<IconButton
						size="small"
						onClick={update(-1)}
						disabled={
							status === "loading" &&
							context?.productId === item.product?.id
						}>
						<Remove />
					</IconButton>
					<Typography>{item.quantity}</Typography>
					<IconButton
						size="small"
						onClick={update(1)}
						disabled={
							status === "loading" &&
							context?.productId === item.product?.id
						}>
						<Add />
					</IconButton>
				</Box>
			</TableCell>
			<TableCell align="right">
				₹ {((item.quantity * item.product?.price!) / 100).toFixed(2)}
			</TableCell>
			<TableCell align="right">
				<IconButton
					size="small"
					disabled={
						status === "loading" &&
						context?.productId === item.product?.id
					}
					onClick={() =>
						dispatch(removeBasketItem(item.product?.id!))
					}>
					<Close />
				</IconButton>
			</TableCell>
		</TableRow>
	);
}

export default BasketItem;
