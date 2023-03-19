import {
	AppBar,
	Container,
	Toolbar,
	Typography,
	Box,
	Button,
	Badge,
	IconButton,
	CircularProgress,
} from "@mui/material";
import AdbIcon from "@mui/icons-material/Adb";
import ThemeToggleButton from "./ThemeToggleButton";
import Search from "./Search";
import { Link, useNavigate } from "react-router-dom";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useAppSelector } from "../store";
import { LoadingButton } from "@mui/lab";
import LoggedInHeaderPart from "./LoggedInHeaderPart";

const links = [{ label: "Browse", to: "/catalog" }];

interface Props {
	theme: string;
	onThemeToggle: () => void;
}

export default function Header({ theme, onThemeToggle }: Props) {
	const {
		basket,
		status: basketStatus,
		loaded: basketLoaded,
	} = useAppSelector((state) => state.basket);
	const itemCount =
		basket?.basketItems.reduce((val, item) => val + item.quantity, 0) ?? 0;

	const navigate = useNavigate();

	return (
		<AppBar position="static">
			<Container maxWidth="xl">
				<Toolbar disableGutters>
					<AdbIcon
						sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
					/>
					<Typography
						variant="h6"
						noWrap
						component={Link}
						to="/"
						sx={{
							mr: 2,
							display: { xs: "none", md: "flex" },
							fontWeight: 700,
							color: "inherit",
							textDecoration: "none",
						}}>
						BookVault
					</Typography>

					<Box
						flexGrow="1"
						display="flex"
						justifyContent="flex-end"
						alignItems="center">
						<Search />
						<Box sx={{ ml: 2 }}>
							{basketLoaded ? (
								<IconButton onClick={() => navigate("/cart")}>
									<Badge
										badgeContent={itemCount}
										color={
											theme === "dark"
												? "success"
												: "secondary"
										}
										showZero>
										<ShoppingCartIcon
											sx={{ color: "white" }}
										/>
									</Badge>
								</IconButton>
							) : (
								<CircularProgress color="secondary" size={10} />
							)}
						</Box>
						<Box
							sx={{
								display: { xs: "none", md: "flex" },
								ml: 2,
							}}>
							{links.map(({ label, to }) => (
								<Button
									key={label}
									sx={{
										my: 2,
										color: "white",
										display: "block",
									}}
									component={Link}
									to={to}>
									{label}
								</Button>
							))}
						</Box>
						<LoggedInHeaderPart />
						<ThemeToggleButton
							theme={theme}
							onToggle={onThemeToggle}
						/>
					</Box>
				</Toolbar>
			</Container>
		</AppBar>
	);
}
