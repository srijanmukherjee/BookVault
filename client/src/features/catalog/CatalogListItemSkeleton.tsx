import { Info } from "@mui/icons-material";
import {
	ListItem,
	ListItemAvatar,
	ListItemText,
	Box,
	Typography,
	Skeleton,
} from "@mui/material";

interface Props {
	product: any;
}

export default function CatalogListItemSkeleton({ product }: Props) {
	return (
		<ListItem alignItems="flex-start" sx={{ display: "flex", pl: 0 }}>
			<ListItemAvatar
				sx={{
					width: "248px",
					height: "374.617px",
				}}>
				<Skeleton
					sx={{ bgcolor: "grey.900", borderRadius: "0.5em" }}
					variant="rectangular"
					width="100%"
					height="100%"
				/>
			</ListItemAvatar>
			<ListItemText inset>
				{product.featured && <Skeleton width="60px" />}
				<Typography
					variant="h5"
					sx={{
						color: "text.primary",
						textDecoration: "none",
						"&:hover": { color: "warning.light" },
					}}>
					<Skeleton width="70%" />
				</Typography>
				<Typography variant="body1" mb={1} mt={1}>
					<Skeleton width="15%" />
				</Typography>
				<Box display="flex" alignItems="center" mb={2}>
					<Skeleton width="20%" />
				</Box>
				<Box display="flex">
					<Typography variant="h1" width="20%">
						<Skeleton />
					</Typography>
				</Box>
			</ListItemText>
		</ListItem>
	);
}
