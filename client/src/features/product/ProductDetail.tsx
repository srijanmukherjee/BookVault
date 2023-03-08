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
import { ProductPrice } from "../catalog/CatalogListItem";
import ProductCartButton from "../../app/components/ProductCartButton";

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
				<Grid
					item
					xs={12}
					md={4}
					display="flex"
					alignItems="center"
					justifyContent="center">
					<Image
						src={product.book?.image!}
						alt={product.book?.name!}
						width="100%"
						style={{
							objectFit: "contain",
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
					<ProductPrice product={product} />
					<Box display="flex" gap="10px" mb={2}>
						<Typography>Genres </Typography>
						<Box display="flex" gap="6px" flexWrap="wrap">
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
					<Box display="flex" gap="10px" mb={2}>
						<Typography>Format </Typography>
						<Box display="flex" gap="6px">
							{[product.book?.format].map((format, index) => (
								<Chip
									color="warning"
									size="small"
									label={format}
									key={index}
								/>
							))}
						</Box>
					</Box>
					<Box mb={2}>
						<Typography variant="h6" mb={2}>
							Buying Options
						</Typography>
						<ProductCartButton product={product} />
					</Box>
					<Box mb={2}>
						<Typography variant="h6" mb={1}>
							Description
						</Typography>
						<Typography>{product.book?.description}</Typography>
					</Box>
					<Box>
						<Typography variant="h6" mb={1}>
							Available languages
						</Typography>
						<Box display="flex" gap="6px">
							{product.book?.languages?.map(({ name }, index) => (
								<Chip
									color="secondary"
									size="small"
									label={name}
									key={index}
								/>
							))}
						</Box>
					</Box>
				</Grid>
			</Grid>
		</Container>
	);
}
