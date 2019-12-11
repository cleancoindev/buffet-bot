import React from 'react'

import { StepperContentProps } from '../constants/interfaces'

import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { Grid, Divider } from '@material-ui/core';

// Import Local Components
import InputField from './InputField'

export default function StepperContent(props: StepperContentProps) {
    const { icedTxState, activeStep, classes, inputs } = props
    // console.log(icedTxState)

    const { condition, action} = icedTxState
    const conditionInputs = condition.userInputs
    const actionInputs = action.userInputs
    // console.log(conditionInputs, actionInputs)
    // Based on the userInputs, render respective inputs



    function getStepContent(stepIndex: number, classes: Record<string, string>) {
        switch (stepIndex) {
            case 0:
                return (
                    <Grid
				container
				direction="row"
				justify="space-evenly"
				alignItems="center"
				style={{ background: "brown", padding: "10px" }}
			>
                        <Grid
                            container
                            item
                            sm={12}
                            xs={12}
                            direction="column"
                            justify="flex-start"
                            alignItems="flex-start"
                            style={{ paddingLeft: '24px', background: "pink", minHeight: "200px" }}

                        >
                            <h1> Step: {stepIndex}</h1>
                            <h2> App: {condition.app}</h2>
                            <h2> Condition: {condition.title}</h2>
                            <Divider style={{background: 'white', width: '100%', marginTop: '16px'}} />
                            {conditionInputs.map((input, key) =>
                                <InputField key={key} inputType={input}></InputField>
                            )}
                        </Grid>
                    </Grid>

                );
            case 1:
                return <h1>Test</h1>
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