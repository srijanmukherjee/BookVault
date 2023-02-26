import { Box, InputBase, alpha, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

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
	const [value, setValue] = useState("");
	return (
		<Box flexGrow="1" display="flex" justifyContent="flex-end">
			<SearchBar className={value ? "open" : ""}>
				<SearchIconWrapper>
					<SearchIcon />
				</SearchIconWrapper>
				<StyledInputBase
					placeholder="Search…"
					inputProps={{ "aria-label": "search" }}
					value={value}
					onChange={(event) => setValue(event.currentTarget.value)}
				/>
			</SearchBar>
		</Box>
	);
}
