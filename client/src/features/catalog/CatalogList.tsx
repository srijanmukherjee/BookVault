import { Divider, List, Typography } from "@mui/material";
import CatalogListItem from "./CatalogListItem";

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
