import React from 'react';

import {
	ConditionOrAction,
	ConditionWhitelistData,
	ActionWhitelistData
} from '../constants/interfaces';

import {
	Grid,
	makeStyles,
	Divider,
	Button,
	withStyles
} from '@material-ui/core';

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
import { RouteComponentProps, useHistory } from 'react-router-dom';
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

	const history = useHistory();

	// Get UserInput Types
	const conditionInputTypes = condition.userInputTypes;
	const actionInputTypes = action.userInputTypes;

	// Apps
	const conditionApp = condition.app;
	const actionApp = action.app;

	console.log(history.location.pathname);
	console.log(history.location.pathname.includes('dashboard'));

	const GelatoButton = withStyles({
		root: {
			// minWidth: '150px',
			boxShadow: 'none',
			textTransform: 'none',
			fontSize: 16,
			padding: '6px 12px',
			marginLeft: '16px',
			lineHeight: 1.5,
			border: '0.5px solid',
			borderColor: COLOURS.salmon,
			// borderRadius: '1px 1px 1px 1px',
			color: 'white',

			'&:hover': {
				backgroundColor: COLOURS.salmon50,
				borderColor: 'white',
				boxShadow: 'none'
			},
			'&:active': {
				boxShadow: 'none',
				backgroundColor: '#0062cc',
				borderColor: '#005cbf'
			}
			// '&:focus': {
			// 	boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)'
			// }
		}
	})(Button);

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
					direction="row"
					justify="space-between"
					alignItems="flex-start"
					// className={classes.box}
					style={{
						// paddingLeft: '24px',
						textAlign: 'left',
						marginTop: '8px'
					}}
				>
					<div style={{ marginRight: 'auto' }}>
						<h2 style={{ marginTop: '0px' }}>
							Instruction Summary
						</h2>
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
					</div>
					<div>
						{history.location.pathname.includes('dashboard') && (
							<GelatoButton
								style={{ marginLeft: '0px' }}
								onClick={() => {
									history.push('/dashboard');
								}}
							>
								Back
							</GelatoButton>
						)}
					</div>
				</Grid>
			</Grid>
			<Grid
				container
				direction="row"
				justify="space-evenly"
				alignItems="center"
				style={{ padding: '10px' }}
			>
				<Divider
					style={{
						background: 'white',
						marginBottom: '8px',
						marginTop: '16px',
						width: 'calc(100%)'
					}}
				/>
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
