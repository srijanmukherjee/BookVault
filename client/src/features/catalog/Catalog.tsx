import {
	Box,
	CircularProgress,
	Container,
	Grid,
	useTheme,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import CatalogHeader from "./CatalogHeader";
import CatalogList from "./CatalogList";
import CatalogFilters from "./filters/CatalogFilters";

const productsUrl = "https://dummyjson.com/products";

export default function Catalog() {
	const [products, setProducts] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const theme = useTheme();

	useEffect(() => {
		axios
			.get(productsUrl)
			.then((response) => response.data.products)
			.then(setProducts)
			.catch(console.error)
			.finally(() => setTimeout(() => setLoading(false), 1000));
	}, []);

	if (loading)
		return (
			<Box
				display="grid"
				sx={{
					placeItems: "center",
					height: `calc(98vh - ${theme.mixins.toolbar.minHeight}px)`,
				}}>
				<CircularProgress size={32} color="primary" />
			</Box>
		);

	return (
		<>
			<CatalogHeader />
			<Container maxWidth="xl">
				<Grid container my={2} columnSpacing={4}>
					<Grid item md={2}>
						<CatalogFilters />
					</Grid>
					<Grid item md={10}>
						{/* TODO: Decide what to do with CatalogListControl */}
						{/* <CatalogListControl /> */}
						<CatalogList products={products} />
					</Grid>
				</Grid>
			</Container>
		</>
	);
}
