import { Info } from "@mui/icons-material";
import {
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
	Rating,
	Box,
	useTheme,
	Chip,
} from "@mui/material";
import { Link } from "react-router-dom";
import Image from "mui-image";
import { Product } from "../../app/models/product";
import ProductCartButton from "../../app/components/ProductCartButton";

interface Props {
	product: Product;
}

export function ProductPrice({ product }: Props) {
	const { price, discount } = product;
	if (!price) return null;

	const discountedPrice = discount ? price * (1 - discount / 100) : price;

	return (
		<Box display="flex" mb={2} alignItems="center">
			<Typography
				fontSize="1.8em"
				sx={{
					mr: "4px",
				}}>
				₹
			</Typography>
			{discount && discountedPrice != price ? (
				<Typography
					sx={{
						fontWeight: 300,
						fontSize: "2.8em",
						display: "flex",
						mr: 2,
					}}>
					{(discountedPrice / 100)
						.toFixed(0)
						.toString()
						.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
				</Typography>
			) : null}
			<Typography
				sx={{
					fontWeight: 300,
					fontSize:
						discount && discountedPrice != price ? "2em" : "2.8em",
					display: "flex",
					textDecoration:
						discount && discountedPrice != price
							? "line-through"
							: "",
					mr: 2,
				}}>
				{(price / 100)
					.toFixed(0)
					.toString()
					.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
			</Typography>
			{discount && discountedPrice != price ? (
				<Typography
					sx={{
						fontWeight: 300,
						fontSize: "1.5em",
						display: "flex",
					}}>
					({discount}% off)
				</Typography>
			) : null}
		</Box>
	);
}

export default function CatalogListItem({ product }: Props) {
	const theme = useTheme();

	return (
		<ListItem alignItems="flex-start" sx={{ display: "flex", pl: 0 }}>
			<ListItemAvatar
				sx={{
					width: "248px",
					my: "auto",
				}}>
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
			</ListItemAvatar>
			<ListItemText inset>
				{product.featured && (
					<Box>
						<Typography
							color={
								theme.palette.mode === "light"
									? "#455a64"
									: "#b0bec5"
							}
							sx={{
								fontSize: "0.8em",
								mb: "5px",
								display: "inline-flex",
								alignItems: "center",
								textDecoration: "none",

								"&:hover": {
									color: "warning.light",
								},
							}}
							component={Link}
							to="#">
							{"Featured "}
							<Info
								sx={{ fontSize: "1.3em", ml: "4px", mb: "2px" }}
							/>
						</Typography>
					</Box>
				)}
				<Typography
					variant="h5"
					component={Link}
					to={`/product/${product.slug}`}
					sx={{
						color: "text.primary",
						textDecoration: "none",
						"&:hover": { color: "warning.light" },
					}}
					title="Title">
					{product.book?.name}
				</Typography>
				<Typography variant="body1" mb={1} mt={1} title="Author">
					{"By "}
					{product.book!.author}
				</Typography>
				<Box display="flex" alignItems="center" mb={2}>
					<Typography component="span" mr={1} mt="3px">
						{product.rating?.toFixed(1)}
					</Typography>
					<Rating
						name="read-only"
						value={parseFloat(product.rating!.toFixed(1))}
						readOnly
						size="small"
						precision={0.5}
					/>
				</Box>
				<Box display="flex" alignItems="center" mb={2}>
					<Typography
						mr={1}
						variant="h5"
						color="primary"
						title="Book format">
						{product.book!.format}
					</Typography>
				</Box>
				<ProductPrice product={product} />
				<Box display="flex" alignItems="center">
					<Typography mr={1}>Languages: </Typography>
					<Box display="flex" gap="10px">
						{product.book!.languages?.map(({ name }, index) => (
							<Chip
								color="primary"
								size="small"
								label={name}
								key={index}
							/>
						))}
					</Box>
				</Box>
				<Box my={3}>
					<ProductCartButton product={product} />
				</Box>
			</ListItemText>
		</ListItem>
	);
}
