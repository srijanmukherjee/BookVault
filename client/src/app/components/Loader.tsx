import { Box, CircularProgress } from "@mui/material";

interface Props {
	size?: string;
	color?: "primary" | "secondary" | "error" | "info" | "success" | "warning" | "inherit";
}

function Loader({ size = "md", color = "primary" }: Props) {
	return (
		<Box display="grid" minHeight="95vh" sx={{ placeItems: "center" }}>
			<CircularProgress size={size} color={color} />
		</Box>
	);
}

export default Loader;
