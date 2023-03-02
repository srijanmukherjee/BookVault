import { Box, Container, Skeleton, Typography } from "@mui/material";
import SortFilters from "./filters/SortFilters";
import { useAppSelector } from "../../app/store";
import { clamp } from "lodash";

export default function CatalogHeader() {
	const { pagination, productParams, status } = useAppSelector(
		(state) => state.catalog
	);
	return (
		<Box sx={{ backgroundColor: "neutral", boxShadow: 3 }}>
			<Container
				maxWidth="xl"
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}>
				{status === "products-loading" ? (
					<Skeleton
						variant="text"
						sx={{ fontSize: "1rem", width: "12ch" }}
					/>
				) : (
					<Typography>
						{pagination.currentPage > 0 ? (
							<>
								{(pagination.currentPage - 1) *
									pagination.itemsPerPage +
									1}
								-
								{clamp(
									pagination.currentPage *
										pagination.itemsPerPage,
									0,
									pagination.itemCount
								)}{" "}
								of {pagination.itemCount}
							</>
						) : (
							"No"
						)}{" "}
						results{" "}
						{productParams.search &&
							`for "${productParams.search}"`}
					</Typography>
				)}
				<SortFilters />
			</Container>
		</Box>
	);
}
