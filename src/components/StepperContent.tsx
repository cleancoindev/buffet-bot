import React from 'react';

import {
	StepperContentProps,
	ConditionOrAction
} from '../constants/interfaces';

// Material UI
import { makeStyles } from '@material-ui/core/styles';

import { Grid, Divider } from '@material-ui/core';

// Import Local Components
import InputField from './InputField';
import { COLOURS } from '../constants/constants';

const useStyles = makeStyles(theme => ({
	box: {
		background: 'none',
		// border: '3px outset #E50078',
		border: `3px outset ${COLOURS.salmon}`,

		borderRadius: '2px 2px 2px 2px'
	},
	boxTitle: {
		fontSize: '16px',
		marginLeft: '10px',
		color: 'white',
		textAlign: 'left'
	},
	createButton: {
		background: COLOURS.salmon,
		minWidth: '100px',
		color: 'white',
		border: 0,
		borderRadius: 3,
		boxShadow: '0 2px 2px 2px rgba(255, 255, 255, .3)',
		height: 48,
		padding: '0 30px',
		margin: 8,
		'&:hover': {
			background: COLOURS.salmon60
		}
	}
}));

export default function StepperContent(props: StepperContentProps) {
	const { icedTxState, activeStep } = props;
	const classes = useStyles();
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
						style={{ padding: '10px' }}
					>
						<Grid
							container
							item
							sm={12}
							xs={12}
							direction="column"
							justify="flex-start"
							alignItems="flex-start"
							className={classes.box}
							style={{
								paddingLeft: '24px',
								minHeight: '200px'
							}}
						>
							<h1> Step: {stepIndex + 1}</h1>
							<h2>
								{' '}
								Condition:{' '}
								<span style={{ color: COLOURS.salmon }}>
									{condition.title}{' '}
								</span>
								on{' '}
								<span style={{ color: COLOURS.salmon }}>
									{condition.app}
								</span>{' '}
							</h2>
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
						style={{ padding: '10px' }}
					>
						<Grid
							container
							item
							sm={12}
							xs={12}
							direction="column"
							justify="flex-start"
							alignItems="flex-start"
							className={classes.box}
							style={{
								paddingLeft: '24px',
								minHeight: '200px'
							}}
						>
							<h1> Step: {stepIndex + 1}</h1>
							<h2>
								Action:{' '}
								<span style={{ color: COLOURS.salmon }}>
									{action.title}
								</span>{' '}
								with{' '}
								<span style={{ color: COLOURS.salmon }}>
									{action.app}
								</span>{' '}
							</h2>
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
					<div style={{ marginBottom: '24px' }}>
						<Grid
							container
							direction="row"
							justify="space-evenly"
							alignItems="center"
							style={{ padding: '10px' }}
						>
							<Grid
								container
								item
								sm={12}
								xs={12}
								direction="column"
								justify="flex-start"
								alignItems="flex-start"
								className={classes.box}
								style={{
									paddingLeft: '24px'
								}}
							>
								<h1> Summary</h1>
								<h2 style={{ textAlign: 'left' }}>
									After creating this IcedTx, gelato will{' '}
									<span style={{ color: COLOURS.salmon }}>
										{action.title}
									</span>{' '}
									with{' '}
									<span style={{ color: COLOURS.salmon }}>
										{action.app}
									</span>{' '}
									when the condition{' '}
									<span style={{ color: COLOURS.salmon }}>
										{condition.title}{' '}
									</span>
									on{' '}
									<span style={{ color: COLOURS.salmon }}>
										{condition.app}
									</span>{' '}
									is fulfilled
								</h2>
								{/* <Divider
						style={{
							background: 'white',
							width: '100%',
							marginTop: '16px'
						}}
					/> */}
							</Grid>
						</Grid>
						<Grid
							container
							direction="row"
							justify="space-evenly"
							alignItems="center"
							style={{ padding: '10px' }}
						>
							<Grid
								container
								item
								sm={12}
								xs={12}
								direction="column"
								justify="flex-start"
								alignItems="flex-start"
								className={classes.box}
								style={{
									paddingLeft: '24px',
									minHeight: '200px'
								}}
							>
								<h2>
									{' '}
									Condition:{' '}
									<span style={{ color: COLOURS.salmon }}>
										{condition.title}{' '}
									</span>
									on{' '}
									<span style={{ color: COLOURS.salmon }}>
										{condition.app}
									</span>{' '}
								</h2>
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
							</Grid>
						</Grid>
						<Grid
							container
							direction="row"
							justify="space-evenly"
							alignItems="center"
							style={{ padding: '10px' }}
						>
							<Grid
								container
								item
								sm={12}
								xs={12}
								direction="column"
								justify="flex-start"
								alignItems="flex-start"
								className={classes.box}
								style={{
									paddingLeft: '24px',
									minHeight: '200px'
								}}
							>
								<h2>
									Action:{' '}
									<span style={{ color: COLOURS.salmon }}>
										{action.title}
									</span>{' '}
									with{' '}
									<span style={{ color: COLOURS.salmon }}>
										{action.app}
									</span>{' '}
								</h2>
								{actionInputTypes.map((input, key) => (
									<InputField
										index={key}
										key={`Action-${key}`}
										inputType={input}
										label={action.inputLabels[key]}
										conditionOrAction={
											ConditionOrAction.Action
										}
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
					</div>
				);
			default:
				return 'Unknown stepIndex';
		}
	}
	return (
		<div style={{ marginBottom: '24px' }}>
			{getStepContent(activeStep, classes)}
		</div>
	);
}
