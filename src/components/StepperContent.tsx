import React from 'react';

import {
	StepperContentProps,
	ConditionOrAction
} from '../constants/interfaces';

import { Grid, Divider } from '@material-ui/core';

// Import Local Components
import InputField from './InputField';

export default function StepperContent(props: StepperContentProps) {
	const { icedTxState, activeStep, classes, inputs } = props;
	// console.log(icedTxState)

	const { condition, action } = icedTxState;
	const conditionInputTypes = condition.userInputTypes;
	const actionInputTypes = action.userInputTypes;

	// User inputs when scrolling back
	const conditionInputs = condition.userInputs;
	const actionInputs = action.userInputs;

	// Apps
	const conditionApp = condition.app;
	const actionApp = action.app;

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
						style={{ background: 'brown', padding: '10px' }}
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
								paddingLeft: '24px',
								background: 'pink',
								minHeight: '200px'
							}}
						>
							<h1> Step: {stepIndex + 1}</h1>
							<h2> App: {condition.app}</h2>
							<h2> Condition: {condition.title}</h2>
							<Divider
								style={{
									background: 'white',
									width: '100%',
									marginTop: '16px'
								}}
							/>
							{conditionInputTypes.map((input, key) => (
								<InputField
									key={`Condition-${key}`}
									index={key}
									inputType={input}
									label={condition.inputLabels[key]}
									conditionOrAction={
										ConditionOrAction.Condition
									}
									inputs={conditionInputs}
									app={conditionApp}
									disabled={false}
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
						style={{ background: 'brown', padding: '10px' }}
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
								paddingLeft: '24px',
								background: 'pink',
								minHeight: '200px'
							}}
						>
							<h1> Step: {stepIndex + 1}</h1>
							<h2> App: {action.app}</h2>
							<h2> Action: {action.title}</h2>
							<Divider
								style={{
									background: 'white',
									width: '100%',
									marginTop: '16px'
								}}
							/>
							{actionInputTypes.map((input, key) => (
								<InputField
									index={key}
									key={`Action-${key}`}
									inputType={input}
									label={action.inputLabels[key]}
									conditionOrAction={ConditionOrAction.Action}
									inputs={actionInputs}
									app={actionApp}
									disabled={false}
								></InputField>
							))}
						</Grid>
					</Grid>
				);
			case 2:
				return (
					<Grid
						container
						direction="row"
						justify="space-evenly"
						alignItems="center"
						style={{ background: 'brown', padding: '10px' }}
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
								paddingLeft: '24px',
								background: 'pink',
								minHeight: '200px'
							}}
						>
							<h1> Summary</h1>
							<h3>
								After creating this IcedTx, gelato will{' '}
								{action.title} with {action.app} when the
								condition {condition.title} on {condition.app}{' '}
								is fulfilled
							</h3>
							<Divider
								style={{
									background: 'white',
									width: '100%',
									marginTop: '16px'
								}}
							/>
							<h2> Condition</h2>
							<h3> App: {condition.app}</h3>
							<h3> IF: {condition.title}</h3>
							{conditionInputTypes.map((input, key) => (
								<InputField
									key={`Condition-${key}`}
									index={key}
									inputType={input}
									label={condition.inputLabels[key]}
									conditionOrAction={
										ConditionOrAction.Condition
									}
									inputs={conditionInputs}
									app={conditionApp}
									disabled={true}
								></InputField>
							))}
							<Divider
								style={{
									background: 'white',
									width: '100%',
									marginTop: '16px'
								}}
							/>
							<h2> Action</h2>
							<h3> App: {action.app}</h3>
							<h3> Do that: {action.title}</h3>
							{actionInputTypes.map((input, key) => (
								<InputField
									index={key}
									key={`Action-${key}`}
									inputType={input}
									label={action.inputLabels[key]}
									conditionOrAction={ConditionOrAction.Action}
									inputs={actionInputs}
									app={actionApp}
									disabled={true}
								></InputField>
							))}
							{/* <Divider
								style={{
									background: 'white',
									width: '100%',
									marginTop: '16px'
								}}
							/>
							<h1>Required prepayment:</h1>
							<h2>0.06ETH ($1.08)</h2> */}
						</Grid>
					</Grid>
				);
			default:
				return 'Unknown stepIndex';
		}
	}
	return <div>{getStepContent(activeStep, classes)}</div>;
}
