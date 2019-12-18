import React from 'react';

import { ConditionOrAction } from '../constants/interfaces';

import { Grid, Divider } from '@material-ui/core';

// Import Local Components
import InputField from './InputField';
import { useIcedTxContext } from '../state/GlobalState';

export default function StepperContent() {
	const { icedTxState } = useIcedTxContext();
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

	return (
		<div style={{ marginBottom: '24px' }}>
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
						After creating this IcedTx, gelato will {action.title}{' '}
						with {action.app} when the condition {condition.title}{' '}
						on {condition.app} is fulfilled
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
							conditionOrAction={ConditionOrAction.Condition}
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
		</div>
	);
}
