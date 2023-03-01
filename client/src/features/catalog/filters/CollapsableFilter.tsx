import { ExpandLess, ExpandMore } from "@mui/icons-material";
import {
	ListItemButton,
	ListItemText,
	Typography,
	Collapse,
	Box,
	CircularProgress,
} from "@mui/material";
import { PropsWithChildren, useState } from "react";

interface Props extends PropsWithChildren {
	collapsed?: boolean;
	label: string;
	disableBottomGutter?: boolean;
	loading?: boolean;
}

export default function CollapsableFilter({
	label,
	collapsed,
	children,
	disableBottomGutter = false,
	loading = false,
}: Props) {
	const [open, setOpen] = useState(collapsed !== true);
	return (
		<>
			<ListItemButton onClick={() => setOpen((state) => !state)}>
				<ListItemText>
					<Typography fontWeight="bold">{label}</Typography>
				</ListItemText>
				{open ? <ExpandLess /> : <ExpandMore />}
			</ListItemButton>

			{loading && (
				<Box display="flex" justifyContent="center" my={2}>
					<CircularProgress size={24} color="primary" />
				</Box>
			)}

			{!loading && (
				<Collapse
					in={open}
					timeout="auto"
					unmountOnExit
					sx={{ mb: disableBottomGutter ? 0 : 2 }}>
					<Box display="flex" flexDirection="column" px={2}>
						{children}
					</Box>
				</Collapse>
			)}
		</>
	);
}
