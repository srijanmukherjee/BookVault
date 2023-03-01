import { Info } from "@mui/icons-material";
import {
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
	Rating,
	Box,
	useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";

interface Props {
	product: any;
}

export default function CatalogListItem({ product }: Props) {
	const theme = useTheme();

	return (
		<ListItem alignItems="flex-start" sx={{ display: "flex", pl: 0 }}>
			<ListItemAvatar
				sx={{
					width: "248px",
					maxHeight: "248px",
					display: "grid",
					aspectRatio: "1/1",
				}}>
				<img
					src={product.book.image}
					alt={product.book.name}
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
					}}>
					{product.book.name}
				</Typography>
				<Typography variant="body1" mb={1} mt={1}>
					{"By "}
					{product.book.author}
				</Typography>
				<Box display="flex" alignItems="center" mb={2}>
					<Typography component="span" mr={1} mt="3px">
						{product.rating.toFixed(1)}
					</Typography>
					<Rating
						name="read-only"
						value={parseFloat(product.rating.toFixed(1))}
						readOnly
						size="small"
						precision={0.5}
					/>
				</Box>
				<Box display="flex">
					<Typography
						fontSize="1.8em"
						sx={{
							mr: "4px",
							mt: "8px",
						}}>
						₹
					</Typography>
					<Typography
						sx={{
							fontWeight: 300,
							fontSize: "2.8em",
							display: "flex",
						}}>
						{(product.price / 100)
							.toFixed(0)
							.toString()
							.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
					</Typography>
				</Box>
			</ListItemText>
		</ListItem>
	);
}
