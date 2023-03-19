import { Box, Button, Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import { useAppSelector } from "../store";

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

function LoggedInHeaderPart() {
	const { user } = useAppSelector((store) => store.account);

	if (!user) return <NotLoggedIn />;
	return null;
}

export default LoggedInHeaderPart;
