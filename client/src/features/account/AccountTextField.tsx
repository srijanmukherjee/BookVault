import { TextField, Typography } from "@mui/material";
import { UseFormRegister, FieldValues } from "react-hook-form";

interface Props {
	label: string;
	name: string;
	margin?: string;
	helperText?: string | JSX.Element;
	spellCheck?: boolean;
	autoComplete?: string;
	type?: string;
	disabled?: boolean;
	register: UseFormRegister<FieldValues>;
	error: any;
}

function AccountTextField({ register, error, ...props }: Props) {
	if (!props.name)
		throw new Error("AccountTextField requires a name property");

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

export default AccountTextField;
