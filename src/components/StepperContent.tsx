import React from "react";

import { StepperContentProps, ConditionOrAction } from "../constants/interfaces";

import { Grid, Divider } from "@material-ui/core";

// Import Local Components
import InputField from "./InputField";

export default function StepperContent(props: StepperContentProps) {
	const { icedTxState, activeStep, classes, inputs } = props;
	// console.log(icedTxState)

	const { condition, action } = icedTxState;
	const conditionInputs = condition.userInputTypes;
    const actionInputs = action.userInputTypes;

	// console.log(conditionInputs, actionInputs)
	// Based on the userInputs, render respective inputs

	function getStepContent(
		stepIndex: number,
		classes: Record<string, string>
	) {
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
							style={{
								paddingLeft: "24px",
								background: "pink",
								minHeight: "200px"
							}}
						>
							<h1> Step: {stepIndex + 1}</h1>
							<h2> App: {condition.app}</h2>
							<h2> Condition: {condition.title}</h2>
							<Divider
								style={{
									background: "white",
									width: "100%",
									marginTop: "16px",
								}}
							/>
							{conditionInputs.map((input, key) => (
								<InputField
                                    key={key}
                                    index={key}
                                    inputType={input}
                                    label={condition.inputLabels[key]}
                                    conditionOrAction={ConditionOrAction.Condition}
								></InputField>
							))}
						</Grid>
					</Grid>
				);
			case 1:
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
							style={{
								paddingLeft: "24px",
								background: "pink",
								minHeight: "200px"
							}}
						>
							<h1> Step: {stepIndex + 1}</h1>
							<h2> App: {action.app}</h2>
							<h2> Action: {action.title}</h2>
							<Divider
								style={{
									background: "white",
									width: "100%",
									marginTop: "16px"
								}}
							/>
							{actionInputs.map((input, key) => (
								<InputField
                                    index={key}
									key={key}
									inputType={input}
                                    label={action.inputLabels[key]}
                                    conditionOrAction={ConditionOrAction.Action}
								></InputField>
							))}
						</Grid>
					</Grid>
				);
			case 2:
				return (
					<div className={classes.stepperContent}>
						<h1>2</h1>
					</div>
				);
			default:
				return "Unknown stepIndex";
		}
	}
	return <div>{getStepContent(activeStep, classes)}</div>;
}
