import React from 'react'

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
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

export default function StepperContent() {

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
    return (
        <h1> I'm the Stepper Content</h1>
    )
}