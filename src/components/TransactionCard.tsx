import React, { useEffect, useState } from 'react';

// Routes
import { Link, useHistory } from 'react-router-dom';

import { Grid, CircularProgress, Button } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TxState, IcedTx, ChainIds } from '../constants/interfaces';

// import ProgressBar from './ProgressBar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import LinkIcon from '@material-ui/icons/Link';
import { useIcedTxContext } from '../state/GlobalState';
import { UPDATE_TX_STATE, COLOURS } from '../constants/constants';
import {
	getTokenSymbol,
	encodeActionPayload,
	encodeTriggerPayload
} from '../helpers/helpers';

// Web3 React
import { useWeb3React } from '@web3-react/core';
import { injected } from '../constants/connectors';
import { useGelatoCore } from '../hooks/hooks';
import { EXECUTOR_ADDRESS } from '../constants/whitelist';
import { ethers } from 'ethers';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		gridItem: {
			paddingLeft: '8px',
			paddingRight: '8px'
		},
		dollar: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-end',
			alignItems: 'center',
			marginLeft: 'auto',
			h4: {
				margin: '0px'
			}
		}
	})
);

enum Progress {
	awaitingModalConfirm,
	awaitingMetamaskConfirm,
	awaitingeMining,
	finished,
	cancelled
}

interface ModalContent {
	title: string;
	progress: Progress;
	progressText: string;
	prepayment: boolean;
	btn: string;
	btnFunc?: Function;
}

interface TxCardProps {
	txState: TxState;
	modalOpen: boolean;
	modalClickOpen: () => void;
	modalClose: () => void;
	icedTxState: IcedTx;
}

/*
export enum TxState {
    preApprove,
    waitingApprove,
	postApprove,
    preCreate,
    waitingCreate,
	postCreate,
	Cancelled,
	InsufficientBalance
}
*/

export default function TransactionCard(props: TxCardProps) {
	const classes = useStyles();
	const {
		icedTxState,
		txState,
		// modalOpen,
		modalClickOpen,
		modalClose
	} = props;

	// Get gelatoCore
	const gelatoCore = useGelatoCore();

	// Get icedTx context
	const { dispatch } = useIcedTxContext();

	// For Routing to Dashboard
	const history = useHistory();

	// Web3React
	const {
		chainId,
		account,
		library,
		active,
		activate,
		deactivate
	} = useWeb3React();

	const [prepayment, setPrepayment] = useState({
		eth: 0,
		dollar: 0
	});
	const [etherscanPrefix, setEtherscanPrefix] = useState('');
	const [txHash, setTxHash] = useState('');
	const [txFee, setTxFee] = useState({
		eth: 0,
		dollar: 0
	});

	const handleClick = (event: React.MouseEvent<unknown>) => {
		if (modalContent.btnFunc === undefined) {
			console.log('undefined');
		} else {
			modalContent.btnFunc();
		}
	};

	async function getGasEstimatePlusBuffer(
		encodedTrigger: string,
		encodedAction: string,
		prepaymentAmount: ethers.utils.BigNumber
	) {
		// @DEV ADD TRY/CATCHS to all ETHEREUM TRANSACTIONS
		const gasEstimate = await gelatoCore.estimate.mintExecutionClaim(
			icedTxState.condition.address,
			encodedTrigger,
			icedTxState.action.address,
			encodedAction,
			// @DEV make dynamic
			EXECUTOR_ADDRESS[4],
			{
				value: ethers.utils.bigNumberify(prepaymentAmount.toString())
			}
		);

		return ethers.utils.bigNumberify('50000').add(gasEstimate);
	}

	async function setTransactionFee() {
		let userAccount = account;

		if (userAccount === undefined || userAccount === null)
			userAccount = '0x0';

		const gelatoGasPriceInWei = await getEthGasStationGasPrice();

		const { encodedTrigger, encodedAction } = encodeActionAndTrigger(
			userAccount
		);

		const prepaymentAmount = await getPrepaymentAmount();

		// Get Gas Estimate
		const gasEstimatePlusBuffer = await getGasEstimatePlusBuffer(
			encodedTrigger,
			encodedAction,
			prepaymentAmount
		);

		const transactionFeeInWei = gelatoGasPriceInWei.mul(
			gasEstimatePlusBuffer
		);

		const { ethAmount, dollar } = await convertWeiToETHAndDollar(
			transactionFeeInWei
		);

		setTxFee({
			eth: parseFloat(ethAmount),
			dollar: parseFloat(dollar)
		});
	}

	async function setPrepaymentAmount() {
		const prepayment = await getPrepaymentAmount();

		const { ethAmount, dollar } = await convertWeiToETHAndDollar(
			prepayment
		);

		setPrepayment({
			eth: parseFloat(ethAmount),
			dollar: parseFloat(dollar)
		});
	}

	async function getPrepaymentAmount() {
		const prepayment = await gelatoCore.getMintingDepositPayable(
			icedTxState.action.address,
			// @DEV Make dynamic
			EXECUTOR_ADDRESS[4]
		);

		return prepayment;
	}

	async function convertWeiToETHAndDollar(costs: ethers.utils.BigNumber) {
		// Calc ETH Amoutn e.g. 0.025 ETH
		const ethAmount = ethers.utils.formatEther(costs);

		// Get EtherScan provider
		let etherscanProvider = new ethers.providers.EtherscanProvider();

		// Getting the current Ethereum price
		let etherPrice = await etherscanProvider.getEtherPrice();

		const dollar = (
			parseFloat(ethAmount) * parseFloat(etherPrice.toString())
		).toFixed(2);

		return { ethAmount: parseFloat(ethAmount).toFixed(4), dollar };
	}

	function encodeActionAndTrigger(account: string) {
		const encodedTrigger = encodeTriggerPayload(
			icedTxState.condition.userInputs,
			icedTxState.condition.params
		);

		const encodedAction = encodeActionPayload(
			icedTxState.action.userInputs,
			icedTxState.action.params,
			account
		);
		return { encodedTrigger, encodedAction };
	}

	// Return gas price in wei with buffer
	async function getEthGasStationGasPrice() {
		// Calculate gas price

		const gasStationResponse = await fetch(
			'https://ethgasstation.info/json/ethgasAPI.json'
		);
		const gasStationJson = await gasStationResponse.json();
		const fastGasPrice = gasStationJson.fast;
		console.log(fastGasPrice);
		const gelatoGasPriceInGwei = ethers.utils
			.bigNumberify(fastGasPrice)
			.div(ethers.utils.bigNumberify('10'))
			.add(ethers.utils.bigNumberify('1'));

		const gelatoGasPriceInWei = ethers.utils.parseUnits(
			gelatoGasPriceInGwei.toString(),
			'gwei'
		);

		return gelatoGasPriceInWei;
	}

	// When Modal renders, set Prepayment value based on the selected action
	useEffect(() => {
		console.log('RENDERING MODAL');
		if (active) {
			setPrepaymentAmount();
			setTransactionFee();
			let prefix;
			switch (chainId) {
				case 1:
					prefix = '';
					break;
				case 3:
					prefix = 'ropsten.';
					break;
				case 4:
					prefix = 'rinkeby.';
					break;
				default:
					prefix = 'rinkeby.';
					break;
			}
			setEtherscanPrefix(prefix);
		}
	}, [active]);

	function returnModalContent(txState: TxState): ModalContent {
		switch (txState) {
			case TxState.displayInstallMetamask:
				return {
					title: `To use gelato, please install the Metamask Plugin`,
					progress: Progress.awaitingModalConfirm,
					progressText: ``,
					prepayment: false,
					btn: 'Install Metamask',
					btnFunc: () => {
						window.open('https://metamask.io/', '_blank');
					}
				};
			case TxState.displayLogIntoMetamask:
				return {
					title: `Please log into Metamask`,
					progress: Progress.awaitingModalConfirm,
					progressText: ``,
					prepayment: false,
					btn: 'Open Metamask',
					btnFunc: () => {
						activate(injected);
					}
				};
			case TxState.displayGelatoWallet:
				return {
					title: `First, lets create a gelato wallet for you!`,
					progress: Progress.awaitingModalConfirm,
					progressText: ``,
					prepayment: false,
					btn: 'Create Wallet'
				};
			case TxState.preGelatoWallet:
				return {
					title: `First, lets create a gelato wallet for you!`,
					progress: Progress.awaitingMetamaskConfirm,
					progressText: `Waiting for Metamask confirmation`,
					prepayment: false,
					btn: ''
				};
			case TxState.waitingGelatoWallet:
				return {
					title: `Creating your gelato wallet ...`,
					progress: Progress.awaitingeMining,
					progressText: `Transaction in progress`,
					prepayment: false,
					btn: ''
				};
			case TxState.postGelatoWallet:
				return {
					title: `Success: Gelato wallet created!`,
					progress: Progress.finished,
					progressText: `Transaction mined`,
					prepayment: false,
					btn: 'Continue'
				};
			case TxState.displayApprove:
				return {
					title: `Approve gelato to move ${getTokenSymbol(
						icedTxState.action.userInputs[
							icedTxState.action.approvalIndex
						].toString()
					)} for you`,
					progress: Progress.awaitingModalConfirm,
					progressText: ``,
					prepayment: false,
					btn: 'Approve'
				};
			case TxState.preApprove:
				return {
					title: `Approve gelato to move ${getTokenSymbol(
						icedTxState.action.userInputs[
							icedTxState.action.approvalIndex
						].toString()
					)} for you`,
					progress: Progress.awaitingMetamaskConfirm,
					progressText: `Waiting for Metamask confirmation`,
					prepayment: false,
					btn: ''
				};
			case TxState.displayCreate:
				return {
					title: `Create your Frozen Transaction`,
					progress: Progress.awaitingModalConfirm,
					progressText: ``,
					prepayment: true,
					btn: 'Create',
					btnFunc: async () => {
						// Change Modal to illustrate that user has to confirm Tx
						console.log('Change TxState to preCreate');
						dispatch({
							type: UPDATE_TX_STATE,
							txState: TxState.preCreate
						});
						const proxyAddress = await gelatoCore.getProxyOfUser(
							account
						);
						// User has Proxy
						if (account !== undefined && account !== null) {
							const {
								encodedTrigger,
								encodedAction
							} = encodeActionAndTrigger(account);

							const prepaymentAmount = await getPrepaymentAmount();

							const gelatoGasPriceInWei = await getEthGasStationGasPrice();

							//  Add 50.000 gas to estimate
							const gasEstimatePlusBuffer = await getGasEstimatePlusBuffer(
								encodedTrigger,
								encodedAction,
								prepaymentAmount
							);

							let overrides = {
								// The maximum units of gas for the transaction to use
								gasLimit: gasEstimatePlusBuffer,

								// The price (in wei) per unit of gas
								gasPrice: gelatoGasPriceInWei,

								// The nonce to use in the transaction
								// nonce: 123,

								// The amount to send with the transaction (i.e. msg.value)
								value: prepaymentAmount

								// The chain ID (or network ID) to use
								// chainId: 3
							};
							try {
								const tx = await gelatoCore.mintExecutionClaim(
									icedTxState.condition.address,
									encodedTrigger,
									icedTxState.action.address,
									encodedAction,
									// @DEV make dynamic
									EXECUTOR_ADDRESS[4],
									overrides
								);

								setTxHash(tx.hash);
								console.log('Change TxState to waitingCreate');
								dispatch({
									type: UPDATE_TX_STATE,
									txState: TxState.waitingCreate
								});
								const txMined = await tx.wait();

								console.log('Change TxState to postCreate');
								dispatch({
									type: UPDATE_TX_STATE,
									txState: TxState.postCreate
								});
							} catch (error) {
								console.log(error);
								console.log('Change TxState to cancelled');
								dispatch({
									type: UPDATE_TX_STATE,
									txState: TxState.cancelled
								});
							}
						} else {
							console.log('ERROR, undefined account');
						}
					}
				};
			case TxState.preCreate:
				return {
					title: `Create your Frozen Transaction`,
					progress: Progress.awaitingMetamaskConfirm,
					progressText: `Waiting for Metamask confirmation`,
					prepayment: true,
					btn: ''
				};
			case TxState.waitingCreate:
				return {
					title: `Creating Frozen Transaction ...`,
					progress: Progress.awaitingeMining,
					progressText: `Transaction in progress`,
					prepayment: true,
					btn: ''
				};
			case TxState.postCreate:
				return {
					title: `Success: Frozen Transaction created!`,
					progress: Progress.finished,
					progressText: `Transaction mined`,
					prepayment: true,
					btn: ''
				};
			case TxState.cancelled:
				return {
					title: `Transaction Cancelled`,
					progress: Progress.cancelled,
					progressText: `Tx cancelled`,
					prepayment: false,
					btn: 'Close',
					btnFunc: modalClose
				};
			default:
				return {
					title: `DEFAULT VALUE`,
					progress: Progress.awaitingMetamaskConfirm,
					progressText: `Waiting for Metamask confirmation`,
					prepayment: false,
					btn: ''
				};
		}
	}

	const incrementTxState = () => {
		modalClose();
		dispatch({
			type: UPDATE_TX_STATE,
			txState: txState + 1
		});
		modalClickOpen();
	};

	// Set default modal Content through txState (are we at approval, insufficient balance, or creation phase transaction wise)
	const [modalContent, setModalContent] = React.useState<ModalContent>(
		returnModalContent(txState)
	);

	// On every render, update the modals content
	useEffect(() => {
		setModalContent(returnModalContent(txState));
	}, [txState]);

	return (
		<div>
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
				style={{
					width: '300px',
					borderStyle: 'solid',
					borderWidth: '2px'
				}}
			>
				<Grid
					className={classes.gridItem}
					container
					item
					sm={12}
					xs={12}
					direction="column"
					justify="flex-start"
					alignItems="center"
					style={{
						background: '#000000',
						color: 'white',
						textAlign: 'center'
					}}
				>
					<h3>{modalContent.title}</h3>
				</Grid>
				{/* {modalContent.progress === Progress.awaitingeMining && (
					<Grid
						className={classes.gridItem}
						container
						item
						sm={12}
						xs={12}
						direction="row"
						justify="flex-start"
						alignItems="center"
						style={{
							background: '#FFFFFF',
							paddingTop: '8px',
							paddingBottom: '8px'
							// borderStyle: 'solid',
							// borderWidth: '2px'
						}}
					>
						<ProgressBar />
					</Grid>
				)} */}

				{modalContent.progress !== Progress.awaitingModalConfirm && (
					<Grid
						className={classes.gridItem}
						container
						item
						sm={12}
						xs={12}
						direction="row"
						justify="flex-start"
						alignItems="center"
						style={{
							background: '#FFFFFF',
							paddingTop: '8px',
							paddingBottom: '8px'
							// borderStyle: 'solid',
							// borderWidth: '2px'
						}}
					>
						{modalContent.progress ===
							Progress.awaitingMetamaskConfirm && (
							<CircularProgress
								size={32}
								style={{ marginRight: '8px' }}
							/>
						)}
						{modalContent.progress === Progress.finished && (
							<CheckCircleIcon
								color={'primary'}
								fontSize={'large'}
								style={{ marginRight: '8px' }}
							/>
						)}
						{modalContent.progress === Progress.cancelled && (
							<CancelIcon
								color={'primary'}
								fontSize={'large'}
								style={{ marginRight: '8px' }}
							/>
						)}

						{modalContent.progress === Progress.awaitingeMining && (
							// <React.Fragment>
							// <ProgressBar />
							<CircularProgress
								size={32}
								style={{ marginRight: '8px' }}
							/>
							// </React.Fragment>
						)}
						<h4>{modalContent.progressText}</h4>
					</Grid>
				)}
				{txState !== TxState.cancelled && (
					<Grid
						className={classes.gridItem}
						container
						item
						sm={12}
						xs={12}
						direction="row"
						justify="space-evenly"
						alignItems="flex-start"
						style={{
							background: '#E8E8E8'
						}}
					>
						<h4>Your Account</h4>
						<h4 style={{ marginLeft: 'auto' }}>0x232...fdf32</h4>
					</Grid>
				)}
				{txState === TxState.postCreate && (
					<Grid
						className={classes.gridItem}
						container
						item
						sm={12}
						xs={12}
						direction="row"
						justify="space-evenly"
						alignItems="center"
						style={{
							background: '#EEEEEE'
						}}
					>
						<h4>Transaction Confirmation</h4>
						<a
							style={{
								display: 'flex',
								alignItems: 'center',
								marginLeft: 'auto'
							}}
							href={`https://${etherscanPrefix}etherscan.io/tx/${txHash}`}
							target="_blank"
						>
							<LinkIcon
								color={'primary'}
								fontSize={'large'}
								// style={{ marginRight: '8px' }}
							/>
						</a>
						{/* <h4 style={{ marginLeft: 'auto' }}>0x232...fdf32</h4> */}
					</Grid>
				)}
				{modalContent.prepayment &&
					txState !== TxState.postCreate &&
					txState !== TxState.cancelled && (
						<Grid
							className={classes.gridItem}
							container
							item
							sm={12}
							xs={12}
							direction="row"
							justify="space-evenly"
							alignItems="center"
							style={{
								background: '#EEEEEE'
							}}
						>
							<h4>Gelato Prepayment</h4>
							<div className={classes.dollar}>
								<h4
									style={{ margin: '0px' }}
								>{`${prepayment.eth} ETH`}</h4>
								<p
									style={{ margin: '0px' }}
								>{`$${prepayment.dollar} USD`}</p>
							</div>
						</Grid>
					)}
				{txState !== TxState.postCreate &&
					txState !== TxState.cancelled && (
						<React.Fragment>
							<Grid
								className={classes.gridItem}
								container
								item
								sm={12}
								xs={12}
								direction="row"
								justify="space-evenly"
								alignItems="center"
								style={{
									background: `${
										modalContent.prepayment
											? '#E8E8E8'
											: '#EEEEEE'
									}`
								}}
							>
								<h4>Transaction Fee</h4>
								<div className={classes.dollar}>
									<h4
										style={{ margin: '0px' }}
									>{`${txFee.eth} ETH`}</h4>
									<p
										style={{ margin: '0px' }}
									>{`$${txFee.dollar} USD`}</p>
								</div>
							</Grid>
							<Grid
								className={classes.gridItem}
								container
								item
								sm={12}
								xs={12}
								direction="row"
								justify="space-evenly"
								alignItems="flex-start"
								style={{
									background: `${
										modalContent.prepayment
											? '#EEEEEE'
											: '#E8E8E8'
									}`
								}}
							>
								<h4>Estimated Wait</h4>
								<h4 style={{ marginLeft: 'auto' }}>
									~ 1 minute
								</h4>
								{/* <h4 style={{ marginLeft: 'auto' }}>~ 1 minute remaining</h4> */}
							</Grid>
						</React.Fragment>
					)}
			</Grid>
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
				style={{
					marginTop: '24px',
					width: '300px',
					marginBottom: '16px'
					// borderStyle: 'solid',
					// borderWidth: '2px'
				}}
			>
				{txState === TxState.postCreate && (
					<React.Fragment>
						<Grid
							container
							item
							sm={12}
							xs={12}
							direction="row"
							justify="center"
							alignItems="center"
							style={{
								background: '#000000',
								color: 'white',
								margin: '0px',
								padding: '16px',
								textAlign: 'center'
							}}
						>
							<h3 style={{ margin: '0px' }}>
								What will happen now?
							</h3>
						</Grid>
						<Grid
							container
							item
							sm={12}
							xs={12}
							direction="row"
							justify="center"
							alignItems="center"
							style={{
								background: 'FFFFFF',
								textAlign: 'center',
								padding: '16px',
								borderStyle: 'solid',
								borderWidth: '2px'
							}}
						>
							<h4 style={{ margin: '0px' }}>
								If the{' '}
								<span style={{ color: COLOURS.salmon }}>
									{icedTxState.condition.title}
								</span>{' '}
								condition you chose is triggered, gelato will{' '}
								<span style={{ color: COLOURS.salmon }}>
									{icedTxState.action.title}
								</span>{' '}
								on{' '}
								<span style={{ color: COLOURS.salmon }}>
									{icedTxState.action.app}
								</span>{' '}
								on your behalf
							</h4>
						</Grid>
						{/* <Grid
							container
							item
							sm={12}
							xs={12}
							direction="row"
							justify="center"
							alignItems="center"
							style={{
								background: 'FFFFFF',
							}}
						>
							<Button
								style={{
									width: '100%',
									borderStyle: 'solid',
									borderWidth: '2px'
								}}
							>
								Share your Configuration
							</Button>
						</Grid> */}
						{/* <Grid
							container
							item
							sm={12}
							xs={12}
							direction="row"
							justify="center"
							alignItems="center"
							style={{
								background: 'FFFFFF',
								margin: '0px'
							}}
						>
							<h3
								style={{
									margin: '8px'
								}}
							>
								or
							</h3>
						</Grid> */}
						<Grid
							container
							item
							sm={12}
							xs={12}
							direction="row"
							justify="center"
							alignItems="center"
							style={{
								background: 'FFFFFF',
								marginTop: '24px'
							}}
						>
							<Button
								onClick={() => history.push('/dashboard')}
								style={{
									width: '100%',
									borderStyle: 'solid',
									borderWidth: '2px'
								}}
							>
								Dashboard
							</Button>
						</Grid>
					</React.Fragment>
				)}
				{txState !== TxState.postCreate && modalContent.btn !== '' && (
					<Grid
						container
						item
						sm={12}
						xs={12}
						direction="row"
						justify="center"
						alignItems="center"
						style={{
							background: 'FFFFFF'
							// marginTop: '24px'
						}}
					>
						<Button
							style={{
								width: '100%',
								borderStyle: 'solid',
								borderWidth: '2px'
							}}
							onClick={handleClick}
						>
							{modalContent.btn}
						</Button>
					</Grid>
				)}
				{/* <Grid
					container
					item
					sm={12}
					xs={12}
					direction="row"
					justify="center"
					alignItems="center"
					style={{
						background: 'FFFFFF',
						marginTop: '24px'
					}}
				>
					<Button
						onClick={incrementTxState}
						style={{
							width: '100%',
							borderStyle: 'solid',
							borderWidth: '2px'
						}}
					>
						Dummy
					</Button>
				</Grid> */}
			</Grid>
		</div>
	);
}
