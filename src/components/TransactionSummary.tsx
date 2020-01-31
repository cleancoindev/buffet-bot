import React, { useEffect } from 'react';

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
	getStatusText,
	getActionResultText
} from '../constants/summaryTest';
import { timestampToDate } from './Inputs/DatePicker';
import { useGelatoCore } from '../hooks/hooks';

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

interface EthersLog {
	transactionLogIndex: number;
	transactionIndex: number;
	blockNumber: number;
	transactionHash: string;
	address: string;
	topics: Array<string>;
	data: string;
	logIndex: number;
	blockHash: string;
}
interface EthersLog2 {
	blockNumber: number;
	blockHash: string;
	transactionIndex: number;
	removed: boolean;
	address: string;
	data: string;
	topics: Array<string>;
	transactionHash: string;
	logIndex: number;
}

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

	const [swapAmount, setSwapAmount] = React.useState(
		ethers.utils.bigNumberify('0')
	);

	const {
		condition,
		action,
		conditionInputs,
		actionInputs,
		pastTransactionHash,
		pastTransaction
	} = props;

	const gelatoCore = useGelatoCore();

	const history = useHistory();

	const { account, library, active, chainId } = useWeb3React();
	const networkId = chainId as ChainIds;

	// console.log(pastTransaction);
	// console.log(condition);
	// console.log(action);

	interface LogOneWay {
		origin: string;
		sendToken: string;
		sendAmount: ethers.utils.BigNumber;
		destination: string;
	}

	interface LogTwoWay {
		origin: string;
		sendToken: string;
		sendAmount: ethers.utils.BigNumber;
		destination: string;
		receiveToken: string;
		receiveAmount: ethers.utils.BigNumber;
		receiver: string;
	}

	// WHat do I have to know about types in advance?
	// 1. abi
	// 2. LogOneWay interface

	// If action has a swap value call this function with LogTwoWay
	const getEvents = async () => {
		const transactionByHash = await library.getTransactionReceipt(
			pastTransaction?.executionHash
		);
		// console.log(transactionByHash);
		const startBlock = transactionByHash.blockNumber;
		const endBlock = startBlock + 1;
		const proxyAddress = await gelatoCore.proxyByUser(account);
		// const abi = [
		// 	'event LogOneWay(address origin, address sendToken, uint256 sendAmount, address destination)'
		// ];

		const abi = [
			'event LogTwoWay(address origin, address sendToken, uint256 sendAmount, address destination, address receiveToken, uint256 receiveAmount, address receiver)'
		];

		transactionByHash.logs.forEach((log: EthersLog) => {
			// console.log(log.address);
		});

		let iface = new ethers.utils.Interface(abi);
		const filter = {
			address: proxyAddress,
			fromBlock: 0,
			transactionHash: pastTransaction?.executionHash
			// fromBlock: startBlock,
			// toBlock: endBlock
		};

		const logs = await library.getLogs(filter);

		try {
			const log = logs.find(
				(log: EthersLog2) =>
					log.transactionHash === pastTransaction?.executionHash
			);
			let event = iface.parseLog(log);
			// console.log(event.values.receiveAmount);
			setSwapAmount(event.values.receiveAmount);
		} catch (error) {
			// console.log(error);
		}
	};

	useEffect(() => {
		// Only show in past Transaction Summary
		if (
			pastTransaction?.executionHash !== null &&
			pastTransaction?.executionHash !== undefined
		)
			getEvents();
	}, []);

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
						textAlign: 'left'
						// marginTop: '8px'
					}}
				>
					<div
						style={{
							marginRight: 'auto',
							maxWidth: '85%',
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
										textAlign: 'left',
										marginTop: '24px',
										fontSize: '18px'
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
												textAlign: 'left',
												marginTop: '24px',
												marginBottom: '8px',
												fontSize: '18px'
											}}
										>
											Instruction, if not executed, will
											expire on:{' '}
										</p>
										<p
											style={{
												textAlign: 'left',
												fontSize: '18px',
												marginTop: '0px',
												color: COLOURS.salmon
											}}
										>
											{`${timestampToDate(
												parseInt(
													pastTransaction?.expiryDate
												)
											)
												.toString()
												.substring(0, 24)}`}
										</p>
										<div style={{}}>
											<p
												style={{
													textAlign: 'left',
													marginBottom: '8px',
													fontSize: '18px'
												}}
											>
												What will happen:{' '}
											</p>
											<p
												style={{
													textAlign: 'left',
													fontSize: '18px',
													color: COLOURS.salmon
												}}
											>
												{`If ${getConditionText(
													conditionInputs,
													condition.id,
													networkId,
													RelevantInputData.all
												)}`}
											</p>
											<p
												style={{
													textAlign: 'left',
													fontSize: '18px',
													color: COLOURS.salmon
												}}
											>
												{`Then ${getActionText(
													actionInputs,
													action.id,
													networkId,
													RelevantInputData.all
												)}`}
											</p>
										</div>
									</React.Fragment>
								)}
								{pastTransaction.status ===
									'executedSuccess' && (
									<React.Fragment>
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
													fontSize: '18px',
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
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'left',
												marginTop: '16px'
											}}
										>
											<p
												style={{
													fontSize: '18px',
													marginRight: '8px',
													marginBottom: '0px'
												}}
											>
												{'Execution Result:'}
											</p>
											<p
												style={{
													color: COLOURS.salmon
												}}
											>
												{getActionResultText(
													actionInputs,
													action.id,
													networkId,
													RelevantInputData.all,
													swapAmount
												)}
											</p>
										</div>
									</React.Fragment>
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
												fontSize: '18px',
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
									{`If ${getConditionText(
										condition.userInputs,
										condition.id,
										networkId,
										RelevantInputData.all
									)}`}
								</p>
								<p
									style={{
										textAlign: 'left',
										fontSize: '18px'
									}}
								>
									{`Then ${getActionText(
										action.userInputs,
										action.id,
										networkId,
										RelevantInputData.all
									)}`}
								</p>
							</div>
						)}
					</div>
					<div style={{ marginTop: '16px' }}>
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
