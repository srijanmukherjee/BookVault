import { Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";

function Copyright(props: any) {
	const theme = useTheme();

	return (
		<Typography
			variant="body2"
			color="text.secondary"
			align="center"
			{...props}>
			{"Copyright © "}
			<Typography
				component={Link}
				color="text.secondary"
				to="https://mui.com/">
				BookVault
			</Typography>{" "}
			{new Date().getFullYear()}
			{"."}
		</Typography>
	);
}

export default Copyright;
