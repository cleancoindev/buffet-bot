import React from 'react';

import {
	ConditionOrAction,
	ConditionWhitelistData,
	ActionWhitelistData,
	RelevantInputData
} from '../constants/interfaces';
import { useWeb3React } from '@web3-react/core';
import { ChainIds } from '../constants/interfaces';

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
import {
	BOX,
	COLOURS,
	DEFAULT_PAST_TRANSACTIONS
} from '../constants/constants';
import { ethers } from 'ethers';

import LinkIcon from '@material-ui/icons/Link';
import { getEtherscanPrefix } from '../helpers/helpers';
import {
	getConditionText,
	getActionText,
	getStatusText
} from '../constants/summaryTest';
import { timestampToDate } from './Inputs/DatePicker';

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
	pastTransactionHash?: string;
	pastTransaction?: PastTransaction;
}

export default function TransactionSummary(props: TxSummaryParams) {
	const classes = useStyles();

	const {
		condition,
		action,
		conditionInputs,
		actionInputs,
		pastTransactionHash,
		pastTransaction
	} = props;

	console.log(pastTransaction);
	console.log((pastTransaction?.status as string) === 'executedSuccess');

	const history = useHistory();

	const { active, chainId } = useWeb3React();
	const networkId = chainId as ChainIds;

	// Get UserInput Types
	const conditionInputTypes = condition.userInputTypes;
	const actionInputTypes = action.userInputTypes;

	// Apps
	const conditionApp = condition.app;
	const actionApp = action.app;

	let etherscanPrefix = '';
	if (active) {
		etherscanPrefix = getEtherscanPrefix(chainId as ChainIds);
	}

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

	console.log(pastTransactionHash);

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
					<div
						style={{
							marginRight: 'auto',
							overflowX: 'auto'

							// overflow: 'hidden'
						}}
					>
						<h2>Instruction Summary</h2>

						{pastTransaction !== undefined && (
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									alignItems: 'flex-start',
									marginTop: '16px'
								}}
							>
								<p
									style={{
										marginTop: '24px',
										fontSize: '1rem'
									}}
								>
									Exeuction Status:{' '}
									<span style={{ color: COLOURS.salmon }}>
										{getStatusText(
											pastTransaction?.status as string
										)}
									</span>
								</p>

								{pastTransaction?.status === 'open' && (
									<React.Fragment>
										<p
											style={{
												marginTop: '24px',
												marginBottom: '8px',
												fontSize: '1rem'
											}}
										>
											Instruction, if not executed, will
											expire on:{' '}
										</p>
										<p
											style={{
												fontSize: '1rem',
												marginTop: '0px',
												color: COLOURS.salmon
											}}
										>
											{`${timestampToDate(
												parseInt(
													pastTransaction?.expiryDate
												)
											)}`}
										</p>
									</React.Fragment>
								)}
								{pastTransaction.status ===
									'executedSuccess' && (
									<div
										style={{
											display: 'flex',
											flexDirection: 'row',
											alignItems: 'center',
											marginTop: '16px'
										}}
									>
										<p
											style={{
												fontSize: '1rem',
												marginRight: '8px',
												marginTop: '-6px',
												marginBottom: '0px'
											}}
										>
											Execution Receipt (Etherscan):
										</p>
										<a
											href={`https://${etherscanPrefix}etherscan.io/tx/${pastTransactionHash}`}
											target="_blank"
										>
											<LinkIcon
												// color={'primary'}
												style={{
													color: COLOURS.salmon,
													marginTop: '0px'
												}}
												fontSize={'large'}
												// style={{ marginRight: '8px' }}
											/>
										</a>
									</div>
								)}
								{pastTransaction.status ===
									'executedFailure' && (
									<div
										style={{
											display: 'flex',
											flexDirection: 'row',
											alignItems: 'center',
											marginTop: '16px'
										}}
									>
										<p
											style={{
												fontSize: '1rem',
												marginRight: '8px',
												marginTop: '-6px',
												marginBottom: '0px'
											}}
										>
											Execution Receipt (Etherscan):
										</p>
										<a
											href={`https://${etherscanPrefix}etherscan.io/tx/${pastTransactionHash}`}
											target="_blank"
										>
											<LinkIcon
												// color={'primary'}
												style={{
													color: COLOURS.salmon,
													marginTop: '0px'
												}}
												fontSize={'large'}
												// style={{ marginRight: '8px' }}
											/>
										</a>
									</div>
								)}
							</div>
						)}

						{/* CONTENT FOR TRANSACTION SUMMARY IN CREATE*/}
						{/* <h2 style={{ textAlign: 'left' }}>
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
						</h2> */}
						{history.location.pathname.includes('instruct') && (
							// <h2 style={{ textAlign: 'left' }}>
							// 	In 2 days, 40 minutes and 10 seconds, your gelato bot will withdraw 10 DAI from your wallet and send it to the following address: 0x99E69499973484a96639f4Fb17893BC96000b3b8
							// </h2>
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
								<p
									style={{
										textAlign: 'left',
										fontSize: '18px'
									}}
								>
									{getActionText(
										action.userInputs,
										action.id,
										networkId,
										RelevantInputData.all
									)}
								</p>
							</div>
						)}
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

					<Divider
						style={{
							background: 'white',
							marginBottom: '8px',
							marginTop: '24px',
							width: '100%'
						}}
					/>
				</Grid>
			</Grid>
			{/* <Grid
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
			</Grid> */}
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
							marginTop: '24px',
							width: '100%'
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
