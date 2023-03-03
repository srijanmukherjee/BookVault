import {
	Box,
	CircularProgress,
	Divider,
	List,
	Typography,
} from "@mui/material";
import CatalogListItem from "./CatalogListItem";
import { Fragment } from "react";
import { useAppSelector } from "../../app/store";
import { productSelectors } from "./catalogSlice";
import CatalogListItemSkeleton from "./CatalogListItemSkeleton";

export default function CatalogList() {
	const products = useAppSelector((state) =>
		productSelectors.selectAll(state)
	);
	const { status, loaded } = useAppSelector((state) => state.catalog);

	if (status === "products-loading" && products.length == 0) {
		return (
			<Box
				display="grid"
				sx={{
					placeItems: "center",
					height: "100%",
				}}>
				<CircularProgress size={32} color="primary" />
			</Box>
		);
	}

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
					if (status === "products-loading") {
						return (
							<Fragment key={index}>
								<CatalogListItemSkeleton product={product} />
								{index < products.length - 1 && (
									<Divider
										variant="fullWidth"
										component="li"
									/>
								)}
							</Fragment>
						);
					} else {
						return (
							<Fragment key={index}>
								<CatalogListItem product={product} />{" "}
								{index < products.length - 1 && (
									<Divider
										variant="fullWidth"
										component="li"
									/>
								)}
							</Fragment>
						);
					}
				})}
			</List>
		</>
	);
}
