import {
	Box,
	Button,
	Checkbox,
	Collapse,
	FormControlLabel,
	FormGroup,
	List,
	Paper,
	Rating,
	Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import CollapsableFilter from "./CollapsableFilter";
import { useState } from "react";

const CATEGORY_COUNT = 20;

interface Props {
	categories: { id: number; name: string }[];
}

function renderCategory(category: { id: number; name: string }, index: number) {
	return (
		<Typography
			key={index}
			component={Link}
			to="#"
			sx={{
				color: "text.primary",
				textDecoration: "none",
				mt: 1,
				fontSize: "small",
				"&:hover": {
					color: "warning.light",
				},
			}}>
			{category.name}
		</Typography>
	);
}

export default function CatalogFilters({ categories }: Props) {
	const [categoriesMore, setCategoriesMore] = useState(false);

	return (
		<Box component={Paper} elevation={2}>
			<List aria-labelledby="filters-list">
				<CollapsableFilter label="Category">
					{categories.slice(0, CATEGORY_COUNT).map(renderCategory)}
					<Collapse in={categoriesMore} timeout="auto" unmountOnExit>
						<Box sx={{ display: "flex", flexDirection: "column" }}>
							{categories
								.slice(CATEGORY_COUNT)
								.map(renderCategory)}
						</Box>
					</Collapse>

					{categories.length > CATEGORY_COUNT && (
						<Button
							onClick={() => setCategoriesMore(!categoriesMore)}>
							{categoriesMore ? "Less" : "More"}
						</Button>
					)}
				</CollapsableFilter>

				<CollapsableFilter label="Condition">
					<FormGroup>
						<FormControlLabel control={<Checkbox />} label="New" />
						<FormControlLabel control={<Checkbox />} label="Used" />
					</FormGroup>
				</CollapsableFilter>

				<CollapsableFilter label="Language">
					<FormGroup>
						<FormControlLabel
							control={<Checkbox />}
							label="English"
						/>
						<FormControlLabel
							control={<Checkbox />}
							label="German"
						/>
						<FormControlLabel
							control={<Checkbox />}
							label="French"
						/>
					</FormGroup>
				</CollapsableFilter>

				<CollapsableFilter label="Format">
					<FormGroup>
						<FormControlLabel
							control={<Checkbox />}
							label="Audiobook"
						/>
						<FormControlLabel
							control={<Checkbox />}
							label="Board book"
						/>
						<FormControlLabel
							control={<Checkbox />}
							label="Bundle"
						/>
						<FormControlLabel
							control={<Checkbox />}
							label="Hardcover"
						/>
						<FormControlLabel
							control={<Checkbox />}
							label="Loose leaf"
						/>
						<FormControlLabel
							control={<Checkbox />}
							label="Paperback"
						/>
					</FormGroup>
				</CollapsableFilter>

				<CollapsableFilter label="Reviews" disableBottomGutter>
					{[4, 3, 2, 1].map((rating, index) => (
						<Typography
							key={index}
							component={Link}
							to="#"
							sx={{
								color: "text.primary",
								textDecoration: "none",
								fontSize: "small",
								"&:hover": {
									color: "warning.light",
								},
								mt: 1,
							}}>
							<Rating
								size="small"
								value={rating}
								sx={{
									verticalAlign: "middle",
									mt: "-4px",
								}}
								readOnly
							/>{" "}
							{" & Up"}
						</Typography>
					))}
				</CollapsableFilter>
			</List>
		</Box>
	);
}
