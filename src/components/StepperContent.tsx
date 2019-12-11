import React from 'react'

import { StepperContentProps } from '../constants/interfaces'

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



export default function StepperContent(props: StepperContentProps) {
    const { icedTxState, activeStep, classes, inputs } = props
    console.log(icedTxState)
    function getStepContent(stepIndex: number, classes: Record<string, string>) {
        switch (stepIndex) {
            case 0:
                return (
                    <div className={classes.stepperContent}>
                        <h1>0</h1>
                    </div>
                );
            case 1:
                return <div className={classes.stepperContent}>
                        <h1>1</h1>
                    </div>;
            case 2:
                return <div className={classes.stepperContent}>
                            <h1>2</h1>
                        </div>;
            default:
                return "Unknown stepIndex";
        }
    }
    return (
        <div>
            {getStepContent(activeStep, classes)}
        </div>
    )
}