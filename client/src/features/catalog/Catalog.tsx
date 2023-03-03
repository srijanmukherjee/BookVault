import { Container, Grid, Pagination } from "@mui/material";
import { useEffect } from "react";
import CatalogHeader from "./CatalogHeader";
import CatalogList from "./CatalogList";
import CatalogFilters from "./filters/CatalogFilters";
import { useAppDispatch, useAppSelector } from "../../app/store";
import { fetchFilters, fetchProducts, setProductParams } from "./catalogSlice";

export default function Catalog() {
	const dispatch = useAppDispatch();
	const { pagination, status, productParams } = useAppSelector(
		(state) => state.catalog
	);

	useEffect(() => {
		Promise.all([dispatch(fetchProducts()), dispatch(fetchFilters())]);
	}, [dispatch]);

	useEffect(() => {
		dispatch(fetchProducts());
	}, [productParams, dispatch]);

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
								onChange={(_, value) => {
									dispatch(setProductParams({ page: value }));
								}}
								disabled={status === "products-loading"}
							/>
						)}
					</Grid>
				</Grid>
			</Container>
		</>
	);
}
