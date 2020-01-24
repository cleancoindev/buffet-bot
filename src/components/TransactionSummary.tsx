import React from 'react';

import {
	ConditionOrAction,
	ConditionWhitelistData,
	ActionWhitelistData
} from '../constants/interfaces';

import { Grid, makeStyles, Divider } from '@material-ui/core';

// Import Local Components
import InputField from './InputField';
import { useIcedTxContext } from '../state/GlobalState';
import { PastTransaction } from '../constants/interfaces';
import {
	findConditionByAddress,
	findActionByAddress,
	decodeConditionPayload,
	decodeActionPayload
} from '../helpers/helpers';
import { RouteComponentProps } from 'react-router-dom';
import { BOX, COLOURS } from '../constants/constants';
import { ethers } from 'ethers';

const useStyles = makeStyles(theme => ({
	box: {
		// border: '3px outset #E50078',
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

interface TxSummaryParams {
	condition: ConditionWhitelistData;
	action: ActionWhitelistData;
	conditionInputs: Array<string | number | ethers.utils.BigNumber | boolean>;
	actionInputs: Array<string | number | ethers.utils.BigNumber | boolean>;
}

export default function TransactionSummary(props: TxSummaryParams) {
	const classes = useStyles();

	const { condition, action, conditionInputs, actionInputs } = props;

	// Get UserInput Types
	const conditionInputTypes = condition.userInputTypes;
	const actionInputTypes = action.userInputTypes;

	// Apps
	const conditionApp = condition.app;
	const actionApp = action.app;

	return (
		<div style={{ marginBottom: '24px', width: '100%' }}>
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
						textAlign: 'left'
					}}
				>
					<h2>Instruction Summary</h2>
					<h2 style={{ textAlign: 'left' }}>
						IF{' '}
						<span style={{ color: COLOURS.salmon }}>
							{condition.title}{' '}
						</span>{' '}
						is activated
					</h2>
					<h2>
						Then{' '}
						<span style={{ color: COLOURS.salmon }}>
							{action.title}
						</span>
					</h2>
					<Divider
						style={{
							background: 'white',
							marginBottom: '8px',
							marginTop: '16px',
							width: 'calc(100%)'
						}}
					/>
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
					// className={classes.box}
					style={{
						// paddingLeft: '24px',
						minHeight: '200px',
						textAlign: 'left'
					}}
				>
					<h2>
						{' '}
						Condition Settings:{' '}
						<span style={{ color: COLOURS.salmon }}>
							{condition.title}{' '}
						</span>
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
							approveIndex={condition.approveIndex}
							relevantInputData={condition.relevantInputData[key]}
						></InputField>
					))}
					<Divider
						style={{
							background: 'white',
							marginBottom: '8px',
							marginTop: '16px',
							width: 'calc(100%)'
						}}
					/>
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
					// className={classes.box}
					style={{
						// paddingLeft: '24px',
						minHeight: '200px',
						textAlign: 'left'
					}}
				>
					<h2>
						Action Settings:{' '}
						<span style={{ color: COLOURS.salmon }}>
							{action.title}
						</span>{' '}
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
							approveIndex={action.approveIndex}
							relevantInputData={action.relevantInputData[key]}
						></InputField>
					))}
				</Grid>
			</Grid>
		</div>
	);
}
