import { Box, Button } from "@mui/material";
import { Product } from "../models/product";
import { LoadingButton } from "@mui/lab";
import { useAppDispatch, useAppSelector } from "../store";
import { addBasketItem } from "../../features/basket/basketSlice";

interface Props {
	product: Product;
}

export default function ProductCartButton({ product }: Props) {
	const dispatch = useAppDispatch();
	const { status, context } = useAppSelector((state) => state.basket);

	const handleCLick = () => {
		dispatch(addBasketItem({ productId: product.id!, quantity: 1 }));
	};

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
