import { Divider, List, Typography } from "@mui/material";
import CatalogListItem from "./CatalogListItem";
import { Fragment } from "react";

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
				{products.slice(0, 16).map((product, index) => {
					return (
						<Fragment key={index}>
							<CatalogListItem
								product={{ ...product, sponsored: index < 2 }}
							/>{" "}
							{index < products.length - 1 && (
								<Divider variant="fullWidth" component="li" />
							)}
						</Fragment>
					);
				})}
			</List>
		</>
	);
}
