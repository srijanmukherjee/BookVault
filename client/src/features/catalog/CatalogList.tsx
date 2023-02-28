import {
	Avatar,
	Divider,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from "@mui/material";
import React from "react";
import CatalogListItem from "./CatalogListItem";
import SortFilters from "./filters/SortFilters";

interface Props {
	products: any[];
}

export default function CatalogList({ products }: Props) {
	return (
		<>
			<Typography variant="h5" sx={{ textTransform: "uppercase" }}>
				Results
			</Typography>
			<List
				sx={{
					width: "100%",
					bgcolor: "background.paper",
				}}>
				{products.map((product, index) => {
					return (
						<>
							<CatalogListItem
								product={{ ...product, sponsored: index < 2 }}
								key={index}
							/>{" "}
							{index < products.length - 1 && (
								<Divider variant="fullWidth" component="li" />
							)}
						</>
					);
				})}
			</List>
		</>
	);
}
