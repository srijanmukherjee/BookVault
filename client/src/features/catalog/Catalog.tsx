import {
	Box,
	CircularProgress,
	Container,
	Grid,
	Pagination,
	useTheme,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import CatalogHeader from "./CatalogHeader";
import CatalogList from "./CatalogList";
import CatalogFilters from "./filters/CatalogFilters";
import { gql, useQuery } from "@apollo/client";

const productsUrl = "https://dummyjson.com/products";
const GET_PRODUCTS = gql`
	query GetCatalog($page: Int!) {
		products(page: $page) {
			data {
				book {
					name
					author
					image
				}
				price
				rating
				discount
				slug
			}
			itemCount
			currentPage
			itemsPerPage
			totalPages
		}

		categories {
			name
			id
		}
	}
`;

export default function Catalog() {
	const [products, setProducts] = useState<any[]>([]);
	const [page, setPage] = useState<number>(1);
	const theme = useTheme();
	const { loading, error, data } = useQuery(GET_PRODUCTS, {
		variables: {
			page: page,
		},
	});

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [page]);

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

	if (error) {
		return <pre>{error.stack}</pre>;
	}

	return (
		<>
			<CatalogHeader />
			<Container maxWidth="xl">
				<Grid container my={2} columnSpacing={4}>
					<Grid item md={2}>
						<CatalogFilters categories={data.categories} />
					</Grid>
					<Grid item md={10}>
						{/* TODO: Decide what to do with CatalogListControl */}
						{/* <CatalogListControl /> */}
						<CatalogList products={data.products.data} />
					</Grid>
					<Grid item md={2} />
					<Grid
						item
						md={10}
						py={2}
						display="flex"
						justifyContent="center">
						<Pagination
							count={data.products.totalPages}
							page={data.products.currentPage}
							boundaryCount={2}
							color="secondary"
							onChange={(_, value) => setPage(value)}
						/>
					</Grid>
				</Grid>
			</Container>
		</>
	);
}
