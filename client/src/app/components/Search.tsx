import { Box, InputBase, alpha, debounce, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { KeyboardEventHandler, useEffect, useMemo, useState } from "react";
import { useAppDispatch } from "../store";
import { setProductParams } from "../../features/catalog/catalogSlice";
import { useLocation, useNavigate } from "react-router-dom";

const SEARCH_DEBOUNCE_TIME = 1000;

const SearchBar = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginLeft: 0,
	width: "100%",
	transition: theme.transitions.create("width"),
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(1),
		width: "30ch",

		"&:focus-within": {
			width: "100%",
		},

		"&.open": {
			width: "100%",
		},
	},
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	width: "100%",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		width: "100%",
	},
}));

export default function Search() {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { search } = useLocation();
	const queryParams = useMemo(() => new URLSearchParams(search), [search]);
	const [searchText, setSearchText] = useState("");
	const handleSearch = useMemo(
		() =>
			debounce((event: any) => {
				const query = event.target.value
					? `?search=${encodeURIComponent(event.target.value)}`
					: "";
				navigate(`/catalog${query}`);
				dispatch(
					setProductParams({
						search: event.target.value,
						page: 1,
					})
				);
			}, SEARCH_DEBOUNCE_TIME),
		[dispatch]
	);

	const handleKeyboard: KeyboardEventHandler<HTMLDivElement> = (event) => {
		if (event.key === "Enter" && searchText) {
			const query = searchText
				? `?search=${encodeURIComponent(searchText)}`
				: "";
			navigate(`/catalog${query}`);
			dispatch(
				setProductParams({
					search: searchText,
					page: 1,
				})
			);
		}
	};

	useEffect(() => {
		const searchQuery = queryParams.get("search");

		if (searchQuery) {
			setSearchText(decodeURIComponent(searchQuery));
		}
	}, [queryParams]);

	return (
		<Box flexGrow="1" display="flex" justifyContent="flex-end">
			<SearchBar
				className={searchText ? "open" : ""}
				onKeyUp={handleKeyboard}>
				<SearchIconWrapper>
					<SearchIcon />
				</SearchIconWrapper>
				<StyledInputBase
					placeholder="Search…"
					inputProps={{ "aria-label": "search" }}
					value={searchText}
					onChange={(event) => {
						setSearchText(event.currentTarget.value);
						handleSearch(event);
					}}
				/>
			</SearchBar>
		</Box>
	);
}
