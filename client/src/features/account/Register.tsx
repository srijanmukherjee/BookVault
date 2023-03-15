import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Copyright from "./Copyright";
import {
	FieldErrors,
	FieldValues,
	UseFormRegister,
	useForm,
} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import { TextFieldProps } from "@material-ui/core";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import { RegistrationParams, requests } from "../../app/api/agent";
import { ApolloError } from "@apollo/client";

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
	password: yup
		.string()
		.required("Password is required ")
		.min(8, DEFAULT_PASSWORD_HINT),
});

type RegistrationFieldProps = {
	label: string;
	name: string;
	helperText?: string | JSX.Element;
	spellCheck?: boolean;
	autoComplete?: string;
	type?: string;
	disabled?: boolean;
	register: UseFormRegister<FieldValues>;
	error: any;
};

function RegistrationField({
	register,
	error,
	...props
}: RegistrationFieldProps) {
	if (!props.name)
		throw new Error("RegistrationField requires a name property");

	const helperText =
		(error && error.message?.toString()) || props.helperText ? (
			<Typography
				component="span"
				fontSize="small"
				ml="-15px"
				pt="10px"
				display="inline-block">
				{error?.message?.toString() ?? props.helperText}
			</Typography>
		) : null;

	const textFieldProps: any = {
		spellCheck: false,
		...props,
		...register(props.name),
		helperText,
	};

	return <TextField {...textFieldProps} fullWidth error={!!error} />;
}

function Register() {
	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isValid },
	} = useForm({
		resolver: yupResolver(schema),
		mode: "all",
	});

	const [registering, setRegistering] = useState(false);

	const onSubmit = async (formData: FieldValues) => {
		setRegistering(true);
		try {
			const { data, errors, extensions } =
				await requests.account.register(formData as RegistrationParams);
			console.log(errors);
		} catch (error) {
			if (
				error instanceof ApolloError &&
				error.graphQLErrors.length == 1
			) {
				const fieldErrors: any =
					error.graphQLErrors[0].extensions?.errors;

				if (!fieldErrors) {
					// SHow some generic error message
				} else {
					let first = true;
					for (const e of fieldErrors) {
						setError(
							e.field,
							{ message: e.errors[0] },
							{ shouldFocus: first }
						);
						first = false;
					}
				}
			}
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
				<Box
					component="form"
					noValidate
					onSubmit={handleSubmit(onSubmit)}
					sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<RegistrationField
								autoComplete="given-name"
								label="First Name"
								name="firstName"
								register={register}
								error={errors.firstName}
								disabled={registering}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<RegistrationField
								label="Last Name"
								autoComplete="family-name"
								name="lastName"
								register={register}
								error={errors.lastName}
								disabled={registering}
							/>
						</Grid>
						<Grid item xs={12}>
							<RegistrationField
								label="Email Address"
								autoComplete="email"
								name="email"
								register={register}
								error={errors.email}
								disabled={registering}
							/>
						</Grid>
						<Grid item xs={12}>
							<RegistrationField
								label="Phone number"
								autoComplete="tel"
								name="phonenumber"
								register={register}
								error={errors.phonenumber}
								disabled={registering}
							/>
						</Grid>
						<Grid item xs={12}>
							<RegistrationField
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
							<Typography
								color="text.secondary"
								textAlign="justify"
								fontSize="small">
								{/* Taken from Amazon :p */}
								By enrolling your mobile phone number, you
								consent to receive automated security
								notifications via text message from BookVault.
								Message and data rates may apply.
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
