import React from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { classes } from "istanbul-lib-coverage";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: "100%"
		},
		backButton: {
			marginRight: theme.spacing(1)
		},
		instructions: {
			marginTop: theme.spacing(1),
			marginBottom: theme.spacing(1)
		},
		stepperContent: {
			background: "black"
		}
	})
);

function getSteps() {
	return ["Set Condition", "Set Action", "Create Recipe"];
}

function getStepContent(stepIndex: number, classes: Record<string, string>) {
	switch (stepIndex) {
		case 0:
			return (
				<div className={classes.stepperContent}>
					<h1>Test</h1>
				</div>
			);
		case 1:
			return "What is an ad group anyways?";
		case 2:
			return "This is the bit I really care about!";
		default:
			return "Unknown stepIndex";
	}
}

export default function HorizontalLabelPositionBelowStepper() {
	const classes = useStyles({});
	const [activeStep, setActiveStep] = React.useState(0);
	const steps = getSteps();

	const handleNext = () => {
		setActiveStep(prevActiveStep => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	return (
		<div className={classes.root}>
			<Stepper activeStep={activeStep} alternativeLabel>
				{steps.map(label => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
					</Step>
				))}
			</Stepper>
			<div>
				{/* Content: LAST STEP */}
				{activeStep === steps.length ? (
					<div>
						<Typography className={classes.instructions}>
							All steps completed
						</Typography>
						<Button onClick={handleReset}>Reset</Button>
					</div>
				) : (

					<div>
						{/* Steps before last */}
						{/* <Typography className={classes.instructions}> */}
							{getStepContent(activeStep, classes)}
						{/* </Typography> */}
						<div>
							<Button
								disabled={activeStep === 0}
								onClick={handleBack}
								className={classes.backButton}
							>
								Back
							</Button>
							<Button
								variant="contained"
								color="primary"
								onClick={handleNext}
							>
								{activeStep === steps.length - 1
									? "Finish"
									: "Next"}
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
