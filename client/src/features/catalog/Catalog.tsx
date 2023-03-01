import {
	Box,
	CircularProgress,
	Container,
	Grid,
	Pagination,
	useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import CatalogHeader from "./CatalogHeader";
import CatalogList from "./CatalogList";
import CatalogFilters from "./filters/CatalogFilters";
import { gql, useQuery } from "@apollo/client";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { fetchCategories, fetchProducts } from "./catalogSlice";

export default function Catalog() {
	const [page, setPage] = useState<number>(1);
	const dispatch = useAppDispatch();
	const { pagination } = useAppSelector((state) => state.catalog);

	useEffect(() => {
		Promise.all([dispatch(fetchProducts()), dispatch(fetchCategories())]);
	}, [dispatch]);

	useEffect(() => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [page]);

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
						<CatalogList />
					</Grid>
					<Grid item md={2} />
					<Grid
						item
						md={10}
						py={2}
						display="flex"
						justifyContent="center">
						{pagination.currentPage > 0 && (
							<Pagination
								count={pagination.totalPages}
								page={pagination.currentPage}
								boundaryCount={2}
								color="secondary"
								onChange={(_, value) => setPage(value)}
							/>
						)}
					</Grid>
				</Grid>
			</Container>
		</>
	);
}
