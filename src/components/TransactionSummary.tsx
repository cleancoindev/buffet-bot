import React from 'react';

import {
	TriggerOrAction,
	TriggerWhitelistData,
	ActionWhitelistData
} from '../constants/interfaces';

import { Grid, makeStyles, Divider } from '@material-ui/core';

// Import Local Components
import InputField from './InputField';
import { useIcedTxContext } from '../state/GlobalState';
import { PastTransaction } from '../constants/interfaces';
import {
	findTriggerByAddress,
	findActionByAddress,
	decodeTriggerPayload,
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
	trigger: TriggerWhitelistData;
	action: ActionWhitelistData;
	triggerInputs: Array<string | number | ethers.utils.BigNumber>;
	actionInputs: Array<string | number | ethers.utils.BigNumber>;
}

export default function TransactionSummary(props: TxSummaryParams) {
	const classes = useStyles();

	const { trigger, action, triggerInputs, actionInputs } = props;

	// Get UserInput Types
	const triggerInputTypes = trigger.userInputTypes;
	const actionInputTypes = action.userInputTypes;

	// Apps
	const triggerApp = trigger.app;
	const actionApp = action.app;

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
					// className={classes.box}
					style={{
						paddingLeft: '24px'
					}}
				>
					<h2> Summary</h2>
					<h2 style={{ textAlign: 'left' }}>
						IF{' '}
						<span style={{ color: COLOURS.salmon }}>
							{trigger.title}{' '}
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
							width: 'calc(100% - 24px)'
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
						paddingLeft: '24px',
						minHeight: '200px'
					}}
				>
					<h2>
						{' '}
						Trigger Summary:{' '}
						<span style={{ color: COLOURS.salmon }}>
							{trigger.title}{' '}
						</span>
					</h2>
					{triggerInputTypes.map((input, key) => (
						<InputField
							key={`Trigger-${key}`}
							index={key}
							inputType={input}
							label={trigger.inputLabels[key]}
							triggerOrAction={TriggerOrAction.Trigger}
							inputs={triggerInputs}
							app={triggerApp}
							disabled={true}
							tokenIndex={trigger.tokenIndex}
						></InputField>
					))}
					<Divider
						style={{
							background: 'white',
							marginBottom: '8px',
							marginTop: '16px',
							width: 'calc(100% - 24px)'
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
						paddingLeft: '24px',
						minHeight: '200px'
					}}
				>
					<h2>
						Action Summary:{' '}
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
							triggerOrAction={TriggerOrAction.Action}
							inputs={actionInputs}
							app={actionApp}
							disabled={true}
							tokenIndex={action.tokenIndex}
						></InputField>
					))}
				</Grid>
			</Grid>
		</div>
	);
}

// return (
// 	<div style={{ marginBottom: '24px' }}>
// 		<Grid
// 			container
// 			direction="row"
// 			justify="space-evenly"
// 			alignItems="center"
// 			style={{ background: 'brown', padding: '10px' }}
// 		>
// 			<Grid
// 				container
// 				item
// 				sm={12}
// 				xs={12}
// 				direction="column"
// 				justify="flex-start"
// 				alignItems="flex-start"
// 				style={{
// 					paddingLeft: '24px',
// 					background: 'pink'
// 				}}
// 			>
// 				<h1> Summary</h1>
// 				<h2 style={{ textAlign: 'left' }}>
// 					Gelato will{' '}
// 					<span style={{ color: 'red' }}>{action.title}</span>{' '}
// 					with <span style={{ color: 'red' }}>{action.app}</span>{' '}
// 					when the trigger{' '}
// 					<span style={{ color: 'red' }}>{trigger.title} </span>
// 					on <span style={{ color: 'red' }}>
// 						{trigger.app}
// 					</span>{' '}
// 					is fulfilled
// 				</h2>
// 				{/* <Divider
// 					style={{
// 						background: 'white',
// 						width: '100%',
// 						marginTop: '16px'
// 					}}
// 				/> */}
// 			</Grid>
// 		</Grid>
// 		<Grid
// 			container
// 			direction="row"
// 			justify="space-evenly"
// 			alignItems="center"
// 			style={{ background: 'brown', padding: '10px' }}
// 		>
// 			<Grid
// 				container
// 				item
// 				sm={12}
// 				xs={12}
// 				direction="column"
// 				justify="flex-start"
// 				alignItems="flex-start"
// 				style={{
// 					paddingLeft: '24px',
// 					background: 'pink',
// 					minHeight: '200px'
// 				}}
// 			>
// 				<h2>
// 					{' '}
// 					Trigger:{' '}
// 					<span style={{ color: 'red' }}>{trigger.title} </span>
// 					on <span style={{ color: 'red' }}>
// 						{trigger.app}
// 					</span>{' '}
// 				</h2>
// 				{triggerInputTypes.map((input, key) => (
// 					<InputField
// 						key={`Trigger-${key}`}
// 						index={key}
// 						inputType={input}
// 						label={trigger.inputLabels[key]}
// 						triggerOrAction={TriggerOrAction.Trigger}
// 						inputs={triggerInputs}
// 						app={triggerApp}
// 						disabled={true}
// 					></InputField>
// 				))}
// 			</Grid>
// 		</Grid>
// 		<Grid
// 			container
// 			direction="row"
// 			justify="space-evenly"
// 			alignItems="center"
// 			style={{ background: 'brown', padding: '10px' }}
// 		>
// 			<Grid
// 				container
// 				item
// 				sm={12}
// 				xs={12}
// 				direction="column"
// 				justify="flex-start"
// 				alignItems="flex-start"
// 				style={{
// 					paddingLeft: '24px',
// 					background: 'pink',
// 					minHeight: '200px'
// 				}}
// 			>
// 				<h2>
// 					{' '}
// 					Action:{' '}
// 					<span style={{ color: 'red' }}>
// 						{action.title}
// 					</span>{' '}
// 					with <span style={{ color: 'red' }}>{action.app}</span>{' '}
// 				</h2>
// 				{actionInputTypes.map((input, key) => (
// 					<InputField
// 						index={key}
// 						key={`Action-${key}`}
// 						inputType={input}
// 						label={action.inputLabels[key]}
// 						triggerOrAction={TriggerOrAction.Action}
// 						inputs={actionInputs}
// 						app={actionApp}
// 						disabled={true}
// 					></InputField>
// 				))}
// 				{/* <Divider
// 							style={{
// 								background: 'white',
// 								width: '100%',
// 								marginTop: '16px'
// 							}}
// 						/>
// 						<h1>Required prepayment:</h1>
// 						<h2>0.06ETH ($1.08)</h2> */}
// 			</Grid>
// 		</Grid>
// 	</div>
// );
