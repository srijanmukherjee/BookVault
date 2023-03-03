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
	debounce,
} from "@mui/material";
import { Link } from "react-router-dom";
import CollapsableFilter from "./CollapsableFilter";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/store";
import { setProductParams } from "../catalogSlice";

const CATEGORY_COUNT = 20;
const FILTER_CHANGE_DEBOUNCE_TIME = 1000;

interface Props {}

function renderCategory(
	category: { id: number; name: string },
	index: number,
	handleClick: (id: number) => void,
	disabled: boolean
) {
	return (
		<Typography
			key={index}
			component={Link}
			to="#"
			onClick={() => !disabled && handleClick(category.id)}
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

export default function CatalogFilters({}: Props) {
	const [categoriesMore, setCategoriesMore] = useState(false);
	const { filters, status, productParams } = useAppSelector(
		(state) => state.catalog
	);
	const { categories, status: filterStatus, languages } = filters;
	const dispatch = useAppDispatch();
	const [selectedLanguages, setSelectedLanguages] = useState<boolean[]>([]);

	const handleCategoryClick = (category: any) => {
		dispatch(setProductParams({ category: parseInt(category) }));
	};

	const handleLanguageFilterChange = debounce(
		(selectedLanguages: boolean[]) => {
			dispatch(
				setProductParams({
					languages: selectedLanguages
						.map((checked, index) =>
							checked
								? parseInt(languages[index].id.toString())
								: null
						)
						.filter(Boolean),
				})
			);
		},
		FILTER_CHANGE_DEBOUNCE_TIME
	);

	useEffect(() => {
		if (languages.length === 0) return;
		if (!productParams.languages || productParams.languages.length === 0) {
			setSelectedLanguages(new Array(languages.length).fill(false));
		} else {
			setSelectedLanguages(
				languages.map(({ id }) => productParams.languages!.includes(id))
			);
		}
	}, [languages]);

	return (
		<Box component={Paper} elevation={2}>
			<List aria-labelledby="filters-list">
				<CollapsableFilter
					label="Category"
					loading={filterStatus === "loading"}>
					{categories
						.slice(0, CATEGORY_COUNT)
						.map((category, index) =>
							renderCategory(
								category,
								index,
								handleCategoryClick,
								status === "products-loading"
							)
						)}
					<Collapse in={categoriesMore} timeout="auto" unmountOnExit>
						<Box sx={{ display: "flex", flexDirection: "column" }}>
							{categories
								.slice(CATEGORY_COUNT)
								.map((category, index) =>
									renderCategory(
										category,
										index,
										handleCategoryClick,
										status === "products-loading"
									)
								)}
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

				<CollapsableFilter
					label="Language"
					loading={filterStatus === "loading"}>
					<FormGroup>
						{languages.map((language, index) => (
							<FormControlLabel
								control={
									<Checkbox
										value={selectedLanguages[index]}
										onChange={(event) => {
											const newSelectedLanguages = [
												...selectedLanguages,
											];
											newSelectedLanguages[index] =
												event.currentTarget.checked;
											setSelectedLanguages(
												newSelectedLanguages
											);
											handleLanguageFilterChange(
												newSelectedLanguages
											);
										}}
									/>
								}
								label={language.name}
								key={language.id}
							/>
						))}
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
