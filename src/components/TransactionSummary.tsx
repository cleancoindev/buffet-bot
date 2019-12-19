import React from 'react';

import { ConditionOrAction } from '../constants/interfaces';

import { Grid, Divider } from '@material-ui/core';

// Import Local Components
import InputField from './InputField';
import { useIcedTxContext } from '../state/GlobalState';
import { PastTransaction } from '../constants/interfaces';
import {
	findConditionByAddress,
	findActionByAddress,
	decodePayload
} from '../helpers/helpers';

interface TransactionSummaryProps {
	pastTransaction: PastTransaction;
}
export default function TransactionSummary(props: TransactionSummaryProps) {
	const { icedTxState } = useIcedTxContext();
	// console.log(icedTxState)
	const { pastTransaction } = props;

	// Get respective conditions and action
	const condition = findConditionByAddress(pastTransaction.conditionAddress);
	const action = findActionByAddress(pastTransaction.actionAddress);

	// Get UserInput Types
	const conditionInputTypes = condition.userInputTypes;
	const actionInputTypes = action.userInputTypes;

	// Get user inputs by decoding payloads
	const conditionInputs = decodePayload(
		pastTransaction.conditionPayload,
		condition.params
	);

	const actionInputs = decodePayload(
		pastTransaction.actionPayload,
		action.params
	);

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
						background: 'pink'
					}}
				>
					<h1> Summary</h1>
					<h2 style={{ textAlign: 'left' }}>
						Gelato will{' '}
						<span style={{ color: 'red' }}>{action.title}</span>{' '}
						with <span style={{ color: 'red' }}>{action.app}</span>{' '}
						when the condition{' '}
						<span style={{ color: 'red' }}>{condition.title} </span>
						on <span style={{ color: 'red' }}>
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
					<h2>
						{' '}
						Condition:{' '}
						<span style={{ color: 'red' }}>{condition.title} </span>
						on <span style={{ color: 'red' }}>
							{condition.app}
						</span>{' '}
					</h2>
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
				</Grid>
			</Grid>
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
					<h2>
						{' '}
						Action:{' '}
						<span style={{ color: 'red' }}>
							{action.title}
						</span>{' '}
						with <span style={{ color: 'red' }}>{action.app}</span>{' '}
					</h2>
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
