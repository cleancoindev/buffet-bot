import React from 'react';

import {
	StepperContentProps,
	ConditionOrAction,
	RelevantInputData,
	ChainIds
} from '../constants/interfaces';

// Material UI
import { makeStyles } from '@material-ui/core/styles';

import { Grid, Divider } from '@material-ui/core';

// Import Local Components
import InputField from './InputField';
import { COLOURS, BOX } from '../constants/constants';
import TransactionSummary from './TransactionSummary';
import { getConditionText } from '../constants/summaryTest';
import { useWeb3React } from '@web3-react/core';

const useStyles = makeStyles(theme => ({
	box: {
		...BOX
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
	const { active, chainId } = useWeb3React();
	const networkId = chainId as ChainIds;

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
							// className={classes.box}
							style={{
								// paddingLeft: '24px',
								minHeight: '200px',
								textAlign: 'left'
							}}
						>
							{/* <h1>
								{' '}
								Step: {stepIndex + 1} - Define the condition that
								will condition the action
							</h1> */}
							<h2>
								{' '}
								Condition:{' '}
								<span style={{ color: COLOURS.salmon }}>
									{condition.title}{' '}
								</span>
								{/* {active &&
									condition.userInputs[0] !== undefined && (
										<div style={{}}>
											<p
												style={{
													textAlign: 'left',
													fontSize: '18px'
												}}
											>
												{getConditionText(
													condition.userInputs,
													condition.id,
													networkId,
													RelevantInputData.all
												)}
											</p>

										</div>
									)} */}
								{/* on{' '}
								<span style={{ color: COLOURS.salmon }}>
									{condition.app}
								</span>{' '} */}
							</h2>
							<Divider
								style={{
									background: 'white',
									marginBottom: '8px',
									marginTop: '16px',
									width: 'calc(100% )'
								}}
							/>
							{conditionInputTypes.map((input, key) => (
								<InputField
									condition={condition}
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
									approveIndex={condition.approveIndex}
									relevantInputData={
										condition.relevantInputData[key]
									}
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
							// className={classes.box}
							style={{
								// paddingLeft: '24px',
								minHeight: '200px',
								textAlign: 'left'
							}}
						>
							{/* <h1>
								{' '}
								Step: {stepIndex + 1} - Define the action gelato
								should execute on your behalf
							</h1> */}
							<h2>
								Action:{' '}
								<span style={{ color: COLOURS.salmon }}>
									{action.title}
								</span>{' '}
								{/* with{' '}
								<span style={{ color: COLOURS.salmon }}>
									{action.app}
								</span>{' '} */}
							</h2>
							<Divider
								style={{
									background: 'white',
									// width: 'calc(100% - 24px)',
									width: 'calc(100% )',
									marginTop: '16px',
									marginBottom: '8px'
								}}
							/>
							{actionInputTypes.map((input, key) => (
								<InputField
									action={action}
									index={key}
									key={`Action-${key}`}
									inputType={input}
									label={action.inputLabels[key]}
									conditionOrAction={ConditionOrAction.Action}
									inputs={actionInputs}
									app={actionApp}
									disabled={false}
									approveIndex={action.approveIndex}
									relevantInputData={
										action.relevantInputData[key]
									}
								></InputField>
							))}
						</Grid>
					</Grid>
				);
			case 2:
				return (
					<TransactionSummary
						condition={condition}
						action={action}
						conditionInputs={conditionInputs}
						actionInputs={actionInputs}
					></TransactionSummary>
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
