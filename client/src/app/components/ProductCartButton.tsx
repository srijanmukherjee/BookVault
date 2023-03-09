import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { Product } from "../models/product";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../store";
import { addBasketItem } from "../../features/basket/basketSlice";
import { Add, Remove } from "@mui/icons-material";

interface Props {
	product: Product;
}

function UpdateCartButton({ product }: Props) {
	const theme = useTheme();
	const dispatch = useAppDispatch();
	const { status, context, basket } = useAppSelector((state) => state.basket);
	const basketItem = basket?.basketItems.find(
		(item) => item.product!.id === product.id
	);

	const update = (change: number) => {
		return () => {
			dispatch(
				addBasketItem({ productId: product.id!, quantity: change })
			);
		};
	};

	return (
		<>
			<Box
				sx={{
					display: "inline-flex",
					alignItems: "center",
					padding: "0.5em",
					border: "2px solid",
					borderColor: theme.palette.primary.dark,
					borderRadius: "99999px",
				}}>
				<IconButton
					onClick={update(-1)}
					disabled={
						status === "loading" &&
						context?.productId === product.id
					}>
					<Remove />
				</IconButton>
				<Typography sx={{ textAlign: "center", px: "2em" }}>
					{basketItem?.quantity}
				</Typography>
				<IconButton
					onClick={update(1)}
					disabled={
						status === "loading" &&
						context?.productId === product.id
					}>
					<Add />
				</IconButton>
			</Box>
		</>
	);
}

export default function ProductCartButton({ product }: Props) {
	const dispatch = useAppDispatch();
	const { status, context, basket } = useAppSelector((state) => state.basket);

	const handleCLick = () => {
		dispatch(addBasketItem({ productId: product.id!, quantity: 1 }));
	};

	if (basket?.basketItems.find((item) => item.product?.id === product.id)) {
		return <UpdateCartButton product={product} />;
	}

	return (
		<Box>
			<LoadingButton
				loading={
					status === "loading" && context?.productId === product.id
				}
				variant="contained"
				size="large"
				color="primary"
				onClick={handleCLick}>
				Add to cart
			</LoadingButton>
		</Box>
	);
}
