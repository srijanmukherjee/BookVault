import { Box, Container, Typography } from "@mui/material";

export default function CatalogHeader() {
	return (
		<Box sx={{ backgroundColor: "neutral", boxShadow: 3 }}>
			<Container
				maxWidth="xl"
				sx={{ p: 2, display: "flex", justifyContent: "space-between" }}>
				<Typography>1-16 of over 100,000 results for "book"</Typography>
			</Container>
		</Box>
	);
}
