import { Box, Container, Typography } from "@mui/material";
import SortFilters from "./filters/SortFilters";

export default function CatalogHeader() {
	return (
		<Box sx={{ backgroundColor: "neutral", boxShadow: 3 }}>
			<Container
				maxWidth="xl"
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				<Typography>1-16 of over 100,000 results for "book"</Typography>
				<SortFilters />
			</Container>
		</Box>
	);
}
