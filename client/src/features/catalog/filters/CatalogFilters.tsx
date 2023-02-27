import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";
import {
	Box,
	Checkbox,
	Collapse,
	FormControlLabel,
	FormGroup,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Paper,
	Rating,
	Typography,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import CollapsableFilter from "./CollapsableFilter";

const categories = [
	"Action & Adventure",
	"Arts, Film & Photography",
	"Biographies, Diaries & True accounts",
	"Business & Economics",
	"Crafts, Hobbies & Home",
	"Engineering",
	"History",
	"Law",
	"Literature & Fiction",
	"Maps & Atlases",
	"Medicine & Health Science Textbooks",
	"Politics",
	"Religion & Spirituality",
	"Sports",
	"Travel & Tourism",
];

export default function CatalogFilters() {
	return (
		<Box component={Paper} elevation={2}>
			<List aria-labelledby="filters-list">
				<CollapsableFilter label="Category">
					{categories.map((category, index) => (
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
							{category}
						</Typography>
					))}
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
