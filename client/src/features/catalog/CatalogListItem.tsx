import { Info } from "@mui/icons-material";
import {
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText,
	Typography,
	Rating,
	Link as MaterialLink,
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
					maxWidth: "248px",
					maxHeight: "248px",
					display: "grid",
					aspectRatio: "1/1",
				}}>
				<img
					src={product.images[0]}
					alt={product.title}
					width="100%"
					height="100%"
					style={{
						objectFit: "cover",
						background: "white",
						borderRadius: "0.5em",
					}}
				/>
			</ListItemAvatar>
			<ListItemText
				secondary={
					<>
						<Typography variant="body2" mb={1}>
							{"By "}
							{product.brand}
						</Typography>
						<Box display="flex" alignItems="center" mb={2}>
							<Typography mr={1}>{product.rating}</Typography>
							<Rating
								name="read-only"
								value={parseFloat(product.rating)}
								readOnly
								size="small"
							/>
							<Typography ml={1}>({product.stock})</Typography>
						</Box>

						<Typography
							sx={{
								fontWeight: 300,
								fontSize: "2.8em",
								display: "flex",
							}}>
							<Typography
								fontSize="0.6em"
								component="span"
								sx={{
									mr: "4px",
									mt: "8px",
								}}>
								₹
							</Typography>
							{product.price
								.toString()
								.replace(
									/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g,
									","
								)}
						</Typography>
					</>
				}
				inset>
				{product.sponsored && (
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
							{"Sponsored "}
							<Info
								sx={{ fontSize: "1.3em", ml: "4px", mb: "2px" }}
							/>
						</Typography>
					</Box>
				)}
				<Typography
					variant="h6"
					component={Link}
					to="#"
					sx={{
						color: "text.primary",
						textDecoration: "none",
						"&:hover": { color: "warning.light" },
					}}>
					{product.title}
				</Typography>
			</ListItemText>
		</ListItem>
	);
}
