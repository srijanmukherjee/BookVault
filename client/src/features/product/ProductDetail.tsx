import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/store";
import {
	fetchProduct,
	fetchProductDescriptionCategories,
	productSelectors,
} from "../catalog/catalogSlice";
import { useEffect } from "react";
import {
	Box,
	Chip,
	CircularProgress,
	Container,
	Grid,
	Typography,
} from "@mui/material";
import Image from "mui-image";

export default function ProductDetail() {
	const { slug } = useParams<{ slug: string }>();
	const dispatch = useAppDispatch();
	const product = useAppSelector((state) =>
		productSelectors.selectById(state, slug!)
	);
	const { status } = useAppSelector((state) => state.catalog);

	useEffect(() => {
		if (!slug) return;

		if (product === undefined || !product.book) {
			dispatch(fetchProduct(slug!));
		} else if (
			product &&
			product.book &&
			(!product?.book?.description || !product?.book.categories)
		) {
			dispatch(fetchProductDescriptionCategories(slug!));
		}
	}, [product, dispatch, slug]);

	if (
		status === "products-loading" ||
		status === "product-information-loading"
	) {
		return (
			<Box display="grid" sx={{ placeItems: "center" }} height="100vh">
				<CircularProgress size={24} />
			</Box>
		);
	}

	if (!product) {
		return <h1>Not found</h1>;
	}

	return (
		<Container maxWidth="xl">
			<Grid container spacing={4} py={4}>
				<Grid item xs={12} md={4} p="5rem">
					<Image
						src={product.book?.image!}
						alt={product.book?.name!}
						width="100%"
						height="100%"
						style={{
							objectFit: "cover",
							background: "white",
							borderRadius: "0.5em",
						}}
					/>
				</Grid>

				<Grid item xs={12} md={8}>
					<Typography variant="h3" mb={2}>
						{product.book?.name}
					</Typography>
					<Typography variant="h4" mb={2}>
						{product.book?.author}
					</Typography>
					<Box display="flex" gap="10px">
						<Typography>Genres </Typography>
						<Box display="flex" gap="6px">
							{product.book?.categories?.map(
								({ name }, index) => (
									<Chip
										color="primary"
										size="small"
										label={name}
										key={index}
									/>
								)
							)}
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}
