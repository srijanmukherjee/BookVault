import { Box, Paper, Tab, Tabs, Typography } from "@mui/material";
import { SyntheticEvent, useState } from "react";

export default function SortFilters() {
	const [value, setValue] = useState(0);
	const handleChange = (event: SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};
	return (
		<Box display="flex" alignItems="center">
			<Typography variant="button" mr={1}>
				Sort by
			</Typography>
			<Tabs
				value={value}
				onChange={handleChange}
				aria-label="Tabs where selection follows focus"
				selectionFollowsFocus
				sx={{ py: 0 }}>
				<Tab label="Relevance" sx={{ my: 0, fontSize: "0.7em" }} />
				<Tab
					label="Price -- Low to High"
					sx={{ my: 0, fontSize: "0.7em" }}
				/>
				<Tab
					label="Price -- High to Low"
					sx={{ my: 0, fontSize: "0.7em" }}
				/>
			</Tabs>
		</Box>
	);
}
