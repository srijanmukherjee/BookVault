import {
	Avatar,
	Box,
	Button,
	Divider,
	IconButton,
	ListItemIcon,
	Menu,
	MenuItem,
	Skeleton,
	Tooltip,
	Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { ViewListRounded, Logout } from "@mui/icons-material";
import { MouseEvent, useState } from "react";
import { logout } from "../../features/account/accountSlice";
import { clearBasket } from "../../features/basket/basketSlice";

function NotLoggedIn() {
	const { status, fetchingCurrentUser } = useAppSelector(
		(store) => store.account
	);
	return (
		<Box display={{ xs: "none", md: "flex" }}>
			<Button
				sx={{
					my: 2,
					color: "white",
					display: "block",
				}}
				component={Link}
				to="/account/login"
				disabled={status === "loading" && fetchingCurrentUser}>
				{fetchingCurrentUser && status == "loading" ? (
					<Skeleton />
				) : (
					"Login"
				)}
			</Button>
			<Button
				sx={{
					my: 2,
					color: "white",
					display: "block",
				}}
				component={Link}
				to="/account/register"
				disabled={status === "loading" && fetchingCurrentUser}>
				{fetchingCurrentUser && status == "loading" ? (
					<Skeleton />
				) : (
					"Register"
				)}
			</Button>
		</Box>
	);
}

function LoggedIn() {
	const dispatch = useAppDispatch();
	const { user, status } = useAppSelector((store) => store.account);
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
	const open = Boolean(anchorEl);

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	return (
		<>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					textAlign: "center",
					ml: "1em",
					mr: "0.5em",
				}}>
				{user && (
					<Typography>
						{user.firstName} {user.lastName}
					</Typography>
				)}
				<Tooltip title="Account settings">
					<IconButton
						onClick={handleClick}
						size="small"
						sx={{ ml: 1 }}
						aria-controls={open ? "account-menu" : undefined}
						aria-haspopup="true"
						aria-expanded={open ? "true" : undefined}
						disabled={status === "loading"}>
						<Avatar sx={{ width: 32, height: 32 }}>
							{user?.firstName!.charAt(0).toUpperCase()}
						</Avatar>
					</IconButton>
				</Tooltip>
			</Box>
			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: "visible",
						filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
						mt: 1.5,
						"& .MuiAvatar-root": {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						"&:before": {
							content: '""',
							display: "block",
							position: "absolute",
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: "background.paper",
							transform: "translateY(-50%) rotate(45deg)",
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
				<MenuItem onClick={handleClose}>
					<Avatar /> Profile
				</MenuItem>
				<Divider />
				<MenuItem component={Link} to="/orders" onClick={handleClose}>
					<ListItemIcon>
						<ViewListRounded fontSize="small" />
					</ListItemIcon>
					My orders
				</MenuItem>
				<MenuItem
					onClick={() => {
						handleClose();
						dispatch(logout());
						dispatch(clearBasket());
					}}>
					<ListItemIcon>
						<Logout fontSize="small" />
					</ListItemIcon>
					Logout
				</MenuItem>
			</Menu>
		</>
	);
}

function LoggedInMenu() {
	const { user } = useAppSelector((store) => store.account);

	if (!user) return <NotLoggedIn />;
	return <LoggedIn />;
}

export default LoggedInMenu;
