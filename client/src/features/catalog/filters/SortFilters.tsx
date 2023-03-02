import { Box, Tab, Tabs, Typography } from "@mui/material";
import { SyntheticEvent, useCallback, useEffect, useState } from "react";
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
	const { status } = useAppSelector((state) => state.catalog);
	const [tabIndex, setTabIndex] = useState(0);
	const handleChange = (event: SyntheticEvent, newValue: number) => {
		setTabIndex(newValue);
	};
	useEffect(() => {
		dispatch(
			setProductParams({
				sortBy: sortingOptions[tabIndex].value,
				page: 1,
			})
		);
	}, [dispatch, tabIndex]);
	return (
		<Box display="flex" alignItems="center">
			<Typography variant="button" mr={1}>
				Sort by
			</Typography>
			<Tabs
				disabled={status === "products-loading"}
				value={tabIndex}
				onChange={handleChange}
				aria-label="Tabs where selection follows focus"
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
