import { Box, Button, Container, Paper, Step, StepLabel, Stepper, Typography } from "@mui/material";
import { useState } from "react";

const steps = ["Shipping address", "Payment details", "Review your order"];

function CheckoutWrapper() {
	const [step, setStep] = useState(0);

	return (
		<Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
			<Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
				<Typography component="h1" variant="h4" align="center">
					Checkout
				</Typography>
				<Stepper activeStep={step} sx={{ pt: 3, pb: 5 }}>
					{steps.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>
				{step === steps.length ? (
					<>
						<Typography variant="h5" gutterBottom>
							Thank you for your order.
						</Typography>
						<Typography variant="subtitle1">
							Your order number is #2001539. We have emailed your order confirmation, and will send you an
							update when your order has shipped.
						</Typography>
					</>
				) : (
					<>
						{/* {getStepContent(activeStep)} */}
						<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
							{step !== 0 && (
								<Button onClick={() => setStep((step) => step - 1)} sx={{ mt: 3, ml: 1 }}>
									Back
								</Button>
							)}

							<Button
								variant="contained"
								onClick={() => setStep((step) => step + 1)}
								sx={{ mt: 3, ml: 1 }}>
								{step === steps.length - 1 ? "Place order" : "Next"}
							</Button>
						</Box>
					</>
				)}
			</Paper>
		</Container>
	);
}

export default CheckoutWrapper;
