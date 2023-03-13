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
import { FieldValues, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";

const phoneRegExp =
	/^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;

const PASSWORD_HINT = "Password must be 8 characters long";

const schema = yup.object({
	firstName: yup.string().required("First name is required"),
	lastName: yup.string().required("Last name is required"),
	email: yup.string().required("Email is required").email(),
	tel: yup
		.string()
		.required("Your phone number is required for registration")
		.matches(phoneRegExp, "Phone number is not valid"),
	password: yup
		.string()
		.required("Password is required ")
		.min(8, PASSWORD_HINT),
});

function Register() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		mode: "all",
	});

	const onSubmit = (data: FieldValues) => {
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
					Sign up
				</Typography>
				<Box
					component="form"
					noValidate
					onSubmit={handleSubmit(onSubmit)}
					sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								autoComplete="given-name"
								fullWidth
								label="First Name"
								{...register("firstName")}
								error={!!errors.firstName}
								helperText={errors.firstName?.message?.toString()}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								id="lastName"
								label="Last Name"
								autoComplete="family-name"
								{...register("lastName")}
								error={!!errors.lastName}
								helperText={errors.lastName?.message?.toString()}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Email Address"
								autoComplete="email"
								{...register("email")}
								error={!!errors.email}
								helperText={errors.email?.message?.toString()}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Phone number"
								autoComplete="tel"
								{...register("tel")}
								error={!!errors.tel}
								helperText={errors.tel?.message?.toString()}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label="Password"
								type="password"
								id="password"
								autoComplete="new-password"
								{...register("password")}
								error={!!errors.password}
								helperText={
									errors.password?.message?.toString() ??
									PASSWORD_HINT
								}
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography>
								By enrolling your mobile phone number, you
								consent to receive automated security
								notifications via text message from Amazon.
								Message and data rates may apply.
							</Typography>
						</Grid>
					</Grid>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}>
						Sign Up
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Typography
								component={Link}
								to="/account/login"
								sx={{
									color: "text.primary",
									textDecoration: "none",
									"&:hover": {
										color: "primary.dark",
									},
								}}>
								{"Already have an account? Sign in"}
							</Typography>
						</Grid>
					</Grid>
				</Box>
			</Box>
			<Copyright sx={{ mt: 5 }} />
		</Container>
	);
}

export default Register;
