import { Box, Tab, Tabs, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { setProductParams } from "../catalogSlice";
import { SortingOptions } from "../../../app/api/agent";

const sortingOptions: { label: string; value: SortingOptions }[] = [
	{ label: "Relevance", value: "RELEVANCE" },
	{ label: "Price -- High to low", value: "PRICE_HIGH_TO_LOW" },
	{ label: "Price -- Low to High", value: "PRICE_LOW_TO_HIGH" },
];

export default function SortFilters() {
	const dispatch = useAppDispatch();
	const { status, productParams } = useAppSelector((state) => state.catalog);
	const [tabIndex, setTabIndex] = useState(
		sortingOptions.findIndex(({ value }) => value === productParams.sortBy)
	);

	const handleChange = (_: SyntheticEvent, newValue: number) => {
		setTabIndex(newValue);
		dispatch(
			setProductParams({
				sortBy: sortingOptions[newValue].value,
				page: 1,
			})
		);
	};

	return (
		<Box display="flex" alignItems="center">
			<Typography variant="button" mr={1}>
				Sort by
			</Typography>
			<Tabs
				disabled={status === "products-loading"}
				value={tabIndex}
				onChange={handleChange}
				aria-label="Sorting options"
				selectionFollowsFocus
				sx={{ py: 0 }}>
				{sortingOptions.map(({ label }, index) => (
					<Tab
						label={label}
						key={index}
						sx={{ my: 0, fontSize: "0.7em" }}
					/>
				))}
			</Tabs>
		</Box>
	);
}
