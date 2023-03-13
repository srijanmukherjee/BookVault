import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Copyright from "./Copyright";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material";

const schema = yup.object({
	email: yup.string().email().required(),
	password: yup
		.string()
		.required()
		.min(8, "Password should be at least 8 characters long"),
});

function Login(): JSX.Element {
	const theme = useTheme();
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: yupResolver(schema), mode: "all" });

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		console.log(data);
	};

	return (
		<Container component="main" maxWidth="xs">
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}>
				<Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				<Box
					component="form"
					onSubmit={handleSubmit(onSubmit)}
					noValidate
					sx={{ mt: 1 }}>
					<TextField
						margin="normal"
						fullWidth
						id="email"
						label="Email Address"
						autoComplete="email"
						{...register("email")}
						error={!!errors.email}
						helperText={errors.email?.message?.toString()}
					/>
					<TextField
						margin="normal"
						fullWidth
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						{...register("password")}
						error={!!errors.password}
						helperText={errors.password?.message?.toString()}
					/>
					<FormControlLabel
						control={<Checkbox value="remember" color="primary" />}
						label="Remember me"
					/>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}>
						Sign In
					</Button>
					<Grid container>
						<Grid item xs>
							<Typography
								component={Link}
								to="#"
								sx={{
									color: "text.secondary",
									textDecoration: "none",
									"&:hover": {
										color: "primary.dark",
									},
								}}>
								Forgot password?
							</Typography>
						</Grid>
						<Grid item>
							<Typography
								component={Link}
								to="/account/register"
								sx={{
									color: "text.primary",
									textDecoration: "none",
									"&:hover": {
										color: "primary.dark",
									},
								}}>
								{"Don't have an account? Sign Up"}
							</Typography>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Copyright sx={{ mt: 8, mb: 4 }} />
		</Container>
	);
}

export default Login;
