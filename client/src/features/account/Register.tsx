import Avatar from "@mui/material/Avatar";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Copyright from "./Copyright";
import { FieldValues, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { RegistrationParams, requests } from "../../app/api/agent";
import { ApolloError } from "@apollo/client";
import { toast } from "react-toastify";
import AccountTextField from "./AccountTextField";

const phoneRegExp =
	/^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;

const DEFAULT_PASSWORD_HINT = "Password must be 8 characters long";

const schema = yup.object({
	firstName: yup.string().required("First name is required"),
	lastName: yup.string().required("Last name is required"),
	email: yup.string().required("Email is required").email(),
	phonenumber: yup
		.string()
		.required("Your phone number is required for registration")
		.matches(phoneRegExp, "Phone number is not valid"),
	password: yup.string().required("Password is required ").min(8, DEFAULT_PASSWORD_HINT),
});

function Register() {
	const {
		register,
		handleSubmit,
		setError,
		reset,
		formState: { errors, isValid },
	} = useForm({
		resolver: yupResolver(schema),
		mode: "all",
	});

	const navigate = useNavigate();

	const [registering, setRegistering] = useState(false);

	const handleError = (error: any) => {
		if (error instanceof ApolloError && error.graphQLErrors.length == 1) {
			const fieldErrors: any = error.graphQLErrors[0].extensions?.errors;

			if (!fieldErrors) {
				toast.error("Something went wrong while creating account");
			} else {
				let first = true;
				for (const e of fieldErrors) {
					setError(e.field, { message: e.errors[0] }, { shouldFocus: first });
					first = false;
				}
			}
		} else {
			toast.error("Something went wrong while creating account");
		}
	};

	const onSubmit = async (formData: FieldValues) => {
		setRegistering(true);
		try {
			const { data } = await requests.account.register(formData as RegistrationParams);
			toast.success(`Account created. We have sent a verification link to ${formData.email}`, {
				autoClose: false,
			});
			navigate("/account/login");
		} catch (error) {
			handleError(error);
		} finally {
			setRegistering(false);
		}
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
				<Box component="form" noValidate onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<AccountTextField
								autoComplete="given-name"
								label="First Name"
								name="firstName"
								register={register}
								error={errors.firstName}
								disabled={registering}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<AccountTextField
								label="Last Name"
								autoComplete="family-name"
								name="lastName"
								register={register}
								error={errors.lastName}
								disabled={registering}
							/>
						</Grid>
						<Grid item xs={12}>
							<AccountTextField
								label="Email Address"
								autoComplete="email"
								name="email"
								register={register}
								error={errors.email}
								disabled={registering}
							/>
						</Grid>
						<Grid item xs={12}>
							<AccountTextField
								label="Phone number"
								autoComplete="tel"
								name="phonenumber"
								register={register}
								error={errors.phonenumber}
								disabled={registering}
							/>
						</Grid>
						<Grid item xs={12}>
							<AccountTextField
								label="Password"
								type="password"
								autoComplete="new-password"
								name="password"
								register={register}
								error={errors.password}
								helperText={DEFAULT_PASSWORD_HINT}
								disabled={registering}
							/>
						</Grid>
						<Grid item xs={12}>
							<Typography color="text.secondary" textAlign="justify" fontSize="small">
								{/* Taken from Amazon :p */}
								By enrolling your mobile phone number, you consent to receive automated security
								notifications via text message from BookVault. Message and data rates may apply.
							</Typography>
						</Grid>
					</Grid>
					<LoadingButton
						loading={registering}
						disabled={!isValid}
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 3, mb: 2 }}>
						Sign Up
					</LoadingButton>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Typography
								component={Link}
								to="/account/login"
								sx={{
									color: "text.secondary",
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
			<Copyright sx={{ my: 5 }} />
		</Container>
	);
}

export default Register;
