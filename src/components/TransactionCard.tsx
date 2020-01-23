import React, { useEffect, useState } from 'react';

// Routes
import { useHistory } from 'react-router-dom';

import { Grid, CircularProgress, Button } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TxState, IcedTx, ChainIds } from '../constants/interfaces';

// import ProgressBar from './ProgressBar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import LinkIcon from '@material-ui/icons/Link';
import { useIcedTxContext } from '../state/GlobalState';
import {
	UPDATE_TX_STATE,
	COLOURS,
	UPDATE_PAST_TRANSACTIONS,
	CLOSE_MODAL,
	SELECTED_NETWORK_NAME,
	MAX_BIG_NUM,
	BOX
} from '../constants/constants';
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

// Smart Contract ABIs
import ERC20_ABI from '../constants/abis/erc20.json';

// CSS
import '../index.css';

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
	closeBtn: boolean;
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

	const networkId = chainId as ChainIds;

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

	function addGasBuffer(weiAmount: ethers.utils.BigNumber) {
		return ethers.utils.bigNumberify('50000').add(weiAmount);
	}

	async function getGasEstimatePlusBuffer(
		encodedTrigger: string,
		encodedAction: string,
		prepaymentAmount: ethers.utils.BigNumber
	) {
		// @DEV ADD TRY/CATCHS to all ETHEREUM TRANSACTIONS
		const gasEstimate = await gelatoCore.estimate.mintExecutionClaim(
			EXECUTOR_ADDRESS[networkId],
			icedTxState.trigger.address[networkId],
			encodedTrigger,
			icedTxState.action.address[networkId],
			encodedAction,
			// @DEV make dynamic
			{
				value: ethers.utils.bigNumberify(prepaymentAmount.toString())
			}
		);

		return addGasBuffer(gasEstimate);
	}

	async function setTransactionFee() {
		let userAccount = account;

		if (userAccount === undefined || userAccount === null)
			userAccount = '0x0';

		const gelatoGasPriceInWei = await getEthGasStationGasPrice();

		let gasEstimatePlusBuffer: ethers.utils.BigNumber = ethers.utils.bigNumberify(
			'1'
		);

		switch (icedTxState.txState) {
			case TxState.displayGelatoWallet:
				const gasEstimate = await gelatoCore.estimate.createUserProxy();
				gasEstimatePlusBuffer = addGasBuffer(gasEstimate);
				break;
			case TxState.displayApprove:
				console.log('in here');
				const proxyAddress = await gelatoCore.proxyByUser(account);

				// Get Erc20 contract
				const signer = library.getSigner();

				const tokenAddress =
					icedTxState.action.userInputs[
						icedTxState.action.approveIndex
					];
				console.log(tokenAddress);
				const erc20 = new ethers.Contract(
					tokenAddress.toString(),
					JSON.stringify(ERC20_ABI),
					signer
				);
				console.log(account);
				console.log(proxyAddress);
				try {
					const gasEstimateApprove = await erc20.estimate.approve(
						proxyAddress,
						MAX_BIG_NUM
					);
					gasEstimatePlusBuffer = addGasBuffer(gasEstimateApprove);
					break;
				} catch (error) {
					console.log('Cant estimate approval');
					console.log(error);
					break;
				}

			case TxState.displayCreate:
				const userProxy = await gelatoCore.proxyByUser(account);
				const {
					encodedTrigger,
					encodedAction
				} = encodeActionAndTrigger(userAccount, userProxy);

				const prepaymentAmount = await getPrepaymentAmount();

				// Get Gas Estimate
				gasEstimatePlusBuffer = await getGasEstimatePlusBuffer(
					encodedTrigger,
					encodedAction,
					prepaymentAmount
				);
				break;

			case TxState.displayCancel:
				console.log(icedTxState.pastTransactionId);
				console.log(icedTxState.pastTransactions);
				const pastTransaction =
					icedTxState.pastTransactions[
						parseInt(icedTxState.pastTransactionId)
					];
				console.log(pastTransaction);

				const estimate = await gelatoCore.estimate.cancelExecutionClaim(
					pastTransaction?.selectedExecutor,
					pastTransaction?.executionClaimId,
					account,
					pastTransaction?.proxyAddress,
					pastTransaction?.trigger,
					pastTransaction?.triggerPayload,
					pastTransaction?.action,
					pastTransaction?.actionPayload,
					pastTransaction?.triggerGasActionTotalGasMinExecutionGas,
					pastTransaction?.expiryDate,
					pastTransaction?.prepayment
				);

				//  Add 50.000 gas to estimate
				gasEstimatePlusBuffer = addGasBuffer(estimate);
				break;
		}

		const transactionFeeInWei = gelatoGasPriceInWei.mul(
			gasEstimatePlusBuffer
		);

		const { ethAmount, dollar } = await convertWeiToETHAndDollar(
			transactionFeeInWei
		);

		// console.log(txFee.eth);
		// console.log(ethAmount);

		// Only update state if returned value is not 0
		if (ethAmount !== '0.0000') {
			setTxFee({
				eth: parseFloat(ethAmount),
				dollar: parseFloat(dollar)
			});
		}
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
			EXECUTOR_ADDRESS[networkId],
			icedTxState.trigger.address[networkId],
			icedTxState.action.address[networkId]
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

	function encodeActionAndTrigger(account: string, userProxy: string) {
		const encodedTrigger = encodeTriggerPayload(
			icedTxState.trigger.userInputs,
			icedTxState.trigger.abi
		);

		const encodedAction = encodeActionPayload(
			icedTxState.action.userInputs,
			icedTxState.action.abi,
			account,
			userProxy
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
		if (active) {
			// Only set prepayment amount if txState is equal displayCreate
			if (txState === TxState.displayCreate) {
				setPrepaymentAmount();
			}
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
				case 42:
					prefix = 'kovan.';
					break;
				default:
					prefix = '';
					break;
			}
			setEtherscanPrefix(prefix);
		}
	}, [active, txState]);

	function returnModalContent(txState: TxState): ModalContent {
		console.log(txState);
		switch (txState) {
			case TxState.displayInstallMetamask:
				return {
					title: `To use gelato, please install the Metamask Plugin`,
					progress: Progress.awaitingModalConfirm,
					progressText: ``,
					prepayment: false,
					closeBtn: true,
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
					closeBtn: true,
					btn: 'Open Metamask',
					btnFunc: () => {
						activate(injected);
						console.log('modal close');
						modalClose();
					}
				};

			case TxState.displayWrongNetwork:
				return {
					title: `Please connect to the ${SELECTED_NETWORK_NAME} Ethereum network.`,
					progress: Progress.awaitingModalConfirm,
					progressText: ``,
					prepayment: false,
					closeBtn: false,
					btn: 'Close',
					btnFunc: () => modalClose()
				};
			case TxState.displayGelatoWallet:
				return {
					title: `First, let's deploy your personal gelato bot!`,
					progress: Progress.awaitingModalConfirm,
					progressText: ``,
					prepayment: false,
					closeBtn: true,
					btn: 'Deploy bot',
					btnFunc: async () => {
						// Change Modal to illustrate that user has to confirm Tx
						console.log('Change TxState to preGelatoWallet');
						dispatch({
							type: UPDATE_TX_STATE,
							txState: TxState.preGelatoWallet
						});

						// User has Proxy
						if (account !== undefined && account !== null) {
							const gelatoGasPriceInWei = await getEthGasStationGasPrice();

							const gasEstimate = await gelatoCore.estimate.createUserProxy();

							const gasEstimatePlusBuffer = addGasBuffer(
								gasEstimate
							);

							let overrides = {
								// The maximum units of gas for the transaction to use
								gasLimit: gasEstimatePlusBuffer,

								// The price (in wei) per unit of gas
								gasPrice: gelatoGasPriceInWei
							};
							try {
								const tx = await gelatoCore.createUserProxy(
									overrides
								);

								setTxHash(tx.hash);
								console.log(
									'Change TxState to waitingGelatoWallet'
								);
								dispatch({
									type: UPDATE_TX_STATE,
									txState: TxState.waitingGelatoWallet
								});
								await tx.wait();

								console.log(
									'Change TxState to postGelatoWallet'
								);
								dispatch({
									type: UPDATE_TX_STATE,
									txState: TxState.postGelatoWallet
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
			case TxState.preGelatoWallet:
				return {
					title: `Please confirm the transaction in Metamask!`,
					progress: Progress.awaitingMetamaskConfirm,
					progressText: `Waiting for confirmation`,
					prepayment: false,
					closeBtn: false,
					btn: ''
				};
			case TxState.waitingGelatoWallet:
				return {
					title: `Deploying your gelato bot ...`,
					progress: Progress.awaitingeMining,
					progressText: `Transaction in progress...`,
					prepayment: false,
					closeBtn: false,
					btn: ''
				};
			case TxState.postGelatoWallet:
				return {
					title: `Success: Your gelato bot is live!`,
					progress: Progress.finished,
					progressText: `Transaction complete`,
					prepayment: false,
					closeBtn: true,
					btn: 'Continue',
					btnFunc: () => {
						incrementTxState();
					}
				};
			case TxState.displayApprove:
				return {
					title: `Approve your gelato bot to move ${getTokenSymbol(
						icedTxState.action.userInputs[
							icedTxState.action.approveIndex
						].toString(),
						networkId,
						icedTxState.action.relevantInputData[
							icedTxState.action.approveIndex
						]
					)} for you`,
					progress: Progress.awaitingModalConfirm,
					progressText: ``,
					prepayment: false,
					closeBtn: true,
					btn: 'Approve',
					btnFunc: async () => {
						// Change Modal to illustrate that user has to confirm Tx
						console.log('Change TxState to preApprove');
						dispatch({
							type: UPDATE_TX_STATE,
							txState: TxState.preApprove
						});
						const proxyAddress = await gelatoCore.proxyByUser(
							account
						);

						console.log(proxyAddress);

						// Get Erc20 contract
						const signer = library.getSigner();
						const tokenAddress =
							icedTxState.action.userInputs[
								icedTxState.action.approveIndex
							];

						const erc20 = new ethers.Contract(
							tokenAddress.toString(),
							JSON.stringify(ERC20_ABI),
							signer
						);

						// User has Proxy
						if (account !== undefined && account !== null) {
							const gelatoGasPriceInWei = await getEthGasStationGasPrice();

							const gasEstimate = await erc20.estimate.approve(
								proxyAddress,
								MAX_BIG_NUM
							);

							const gasEstimatePlusBuffer = addGasBuffer(
								gasEstimate
							);

							let overrides = {
								// The maximum units of gas for the transaction to use
								gasLimit: gasEstimatePlusBuffer,

								// The price (in wei) per unit of gas
								gasPrice: gelatoGasPriceInWei
							};
							try {
								const tx = await erc20.approve(
									proxyAddress,
									MAX_BIG_NUM,
									overrides
								);

								setTxHash(tx.hash);
								console.log('Change TxState to displayCreate');
								dispatch({
									type: UPDATE_TX_STATE,
									txState: TxState.displayCreate
								});
								// WE SKIP THE WAITING FOR THE TX FOR APPROVE
								// await tx.wait();

								// console.log(
								// 	'Change TxState to postGelatoWallet'
								// );
								// dispatch({
								// 	type: UPDATE_TX_STATE,
								// 	txState: TxState.postGelatoWallet
								// });
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
			case TxState.preApprove:
				return {
					title: `Please confirm the transaction in Metamask`,
					progress: Progress.awaitingMetamaskConfirm,
					progressText: `Waiting for confirmation`,
					prepayment: false,
					closeBtn: false,
					btn: 'Cancel',
					btnFunc: () => {
						// Change state back to display approve:
						console.log('Change TxState to displayApprove');
						dispatch({
							type: UPDATE_TX_STATE,
							txState: TxState.displayApprove
						});
					}
				};
			case TxState.displayCreate:
				return {
					title: `Instruct your gelato bot`,
					progress: Progress.awaitingModalConfirm,
					progressText: ``,
					prepayment: true,
					closeBtn: true,
					btn: 'Submit Instruction',
					btnFunc: async () => {
						// Change Modal to illustrate that user has to confirm Tx
						console.log('Change TxState to preCreate');
						dispatch({
							type: UPDATE_TX_STATE,
							txState: TxState.preCreate
						});
						const proxyAddress = await gelatoCore.proxyByUser(
							account
						);
						console.log(icedTxState);
						// User has Proxy
						if (account !== undefined && account !== null) {
							const {
								encodedTrigger,
								encodedAction
							} = encodeActionAndTrigger(account, proxyAddress);

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
							/*
							 address _selectedExecutor,
							IGelatoTrigger _trigger,
							bytes calldata _triggerPayloadWithSelector,
							IGelatoAction _action,
							bytes calldata _actionPayloadWithSelector
							*/
							try {
								const tx = await gelatoCore.mintExecutionClaim(
									EXECUTOR_ADDRESS[networkId],
									icedTxState.trigger.address[networkId],
									encodedTrigger,
									icedTxState.action.address[networkId],
									encodedAction,
									// @DEV make dynamic
									overrides
								);

								setTxHash(tx.hash);
								console.log('Change TxState to waitingCreate');
								dispatch({
									type: UPDATE_TX_STATE,
									txState: TxState.waitingCreate
								});
								await tx.wait();

								console.log('Change TxState to postCreate');
								dispatch({
									type: UPDATE_TX_STATE,
									txState: TxState.postCreate
								});
							} catch (error) {
								// console.log(error);
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
					title: `Please confirm the transaction in Metamask`,
					progress: Progress.awaitingMetamaskConfirm,
					progressText: `Waiting for confirmation`,
					prepayment: true,
					closeBtn: false,
					btn: 'Cancel',
					btnFunc: () => {
						console.log('Change TxState to displayCreate');
						dispatch({
							type: UPDATE_TX_STATE,
							txState: TxState.displayCreate
						});
					}
				};
			case TxState.waitingCreate:
				return {
					title: `Instructing your gelato bot ...`,
					progress: Progress.awaitingeMining,
					progressText: `Transaction in progress...`,
					prepayment: true,
					closeBtn: false,
					btn: ''
				};
			case TxState.postCreate:
				return {
					title: `Success: Instruction submitted!`,
					progress: Progress.finished,
					progressText: `Transaction mined`,
					prepayment: true,
					closeBtn: false,
					btn: ''
				};
			case TxState.displayCancel:
				return {
					title: `Cancel this instruction`,
					progress: Progress.awaitingModalConfirm,
					progressText: ``,
					prepayment: true,
					closeBtn: true,
					btn: 'Cancel instruction',
					btnFunc: async () => {
						// Change Modal to illustrate that user has to confirm Tx
						console.log('Change TxState to preCancel');
						dispatch({
							type: UPDATE_TX_STATE,
							txState: TxState.preCancel
						});

						const pastTransaction =
							icedTxState.pastTransactions[
								parseInt(icedTxState.pastTransactionId)
							];

						// User has Proxy
						if (
							pastTransaction !== undefined &&
							pastTransaction !== null
						) {
							const gelatoGasPriceInWei = await getEthGasStationGasPrice();

							const estimate = await gelatoCore.estimate.cancelExecutionClaim(
								pastTransaction?.selectedExecutor,
								pastTransaction?.executionClaimId,
								account,
								pastTransaction?.proxyAddress,
								pastTransaction?.trigger,
								pastTransaction?.triggerPayload,
								pastTransaction?.action,
								pastTransaction?.actionPayload,
								pastTransaction?.triggerGasActionTotalGasMinExecutionGas,
								pastTransaction?.expiryDate,
								pastTransaction?.prepayment
							);

							//  Add 50.000 gas to estimate
							const gasEstimatePlusBuffer = addGasBuffer(
								estimate
							);

							let overrides = {
								// The maximum units of gas for the transaction to use
								gasLimit: gasEstimatePlusBuffer,

								// The price (in wei) per unit of gas
								gasPrice: gelatoGasPriceInWei

								// The chain ID (or network ID) to use
								// chainId: 3
							};
							/*
								address _selectedExecutor,
							IGelatoTrigger _trigger,
							bytes calldata _triggerPayloadWithSelector,
							IGelatoAction _action,
							bytes calldata _actionPayloadWithSelector
							*/

							try {
								// Find past executcion Claim with executionClaimId

								const tx = await gelatoCore.cancelExecutionClaim(
									pastTransaction?.selectedExecutor,
									pastTransaction?.executionClaimId,
									account,
									pastTransaction?.proxyAddress,
									pastTransaction?.trigger,
									pastTransaction?.triggerPayload,
									pastTransaction?.action,
									pastTransaction?.actionPayload,
									pastTransaction?.triggerGasActionTotalGasMinExecutionGas,
									pastTransaction?.expiryDate,
									pastTransaction?.prepayment,
									overrides
								);

								// ######
								// ONLY FOR TESTING

								// const tx = await gelatoCore.canExecute(
								// 	pastTransaction?.executionClaimId,
								// 	pastTransaction?.proxyAddress,
								// 	pastTransaction?.trigger,
								// 	pastTransaction?.triggerPayload,
								// 	pastTransaction?.action,
								// 	pastTransaction?.actionPayload,
								// 	pastTransaction?.triggerGasActionTotalGasMinExecutionGas,
								// 	1000000,
								// 	pastTransaction?.expiryDate,
								// 	pastTransaction?.prepayment
								// );

								// ###################

								// console.log(tx);

								setTxHash(tx.hash);
								console.log('Change TxState to waitingCancel');
								dispatch({
									type: UPDATE_TX_STATE,
									txState: TxState.waitingCancel
								});
								await tx.wait();

								console.log('Change TxState to postCancel');
								dispatch({
									type: UPDATE_TX_STATE,
									txState: TxState.postCancel
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
			case TxState.preCancel:
				return {
					title: `Please confirm the cancellation in Metamask`,
					progress: Progress.awaitingMetamaskConfirm,
					progressText: `Waiting for confirmation`,
					prepayment: true,
					closeBtn: true,
					btn: ''
				};
			case TxState.waitingCancel:
				return {
					title: `Cancelling instruction ...`,
					progress: Progress.awaitingeMining,
					progressText: `Transaction in progress...`,
					prepayment: true,
					closeBtn: false,
					btn: ''
				};
			case TxState.postCancel:
				return {
					title: `Success: Instruction cancelled!`,
					progress: Progress.finished,
					progressText: `Transaction mined`,
					prepayment: true,
					closeBtn: false,
					btn: 'Close',
					btnFunc: () => {
						// @ DEV Maybe make more efficient!
						modalClose();
						window.location.reload();
					}
				};
			case TxState.cancelled:
				return {
					title: `Instruction cancelled`,
					progress: Progress.cancelled,
					progressText: `Tx cancelled`,
					prepayment: false,
					closeBtn: false,
					btn: 'Close',
					btnFunc: () => {
						modalClose();
						console.log('Change TxState to insufficientBalance');
						dispatch({
							type: UPDATE_TX_STATE,
							txState: TxState.displayInstallMetamask
						});
					}
				};
			case TxState.inputError:
				return {
					title: `${icedTxState.error.msg}`,
					progress: Progress.cancelled,
					progressText: `Please input a correct value`,
					prepayment: false,
					closeBtn: false,
					btn: 'OK',
					btnFunc: () => {
						console.log('Change TxState to displayApprove');
						modalClose();
						// dispatch({
						// 	type: UPDATE_TX_STATE,
						// 	txState: TxState.displayApprove
						// });
					}
				};
			case TxState.insufficientBalance:
				return {
					title: `Insufficient ETH Balance`,
					progress: Progress.cancelled,
					progressText: `You require more ETH`,
					prepayment: false,
					closeBtn: false,
					btn: 'OK',
					btnFunc: () => {
						console.log('Change TxState to displayApprove');
						modalClose();
						// dispatch({
						// 	type: UPDATE_TX_STATE,
						// 	txState: TxState.displayApprove
						// });
					}
				};
			default:
				return {
					title: `DEFAULT VALUE`,
					progress: Progress.awaitingMetamaskConfirm,
					progressText: `Waiting for confirmation`,
					prepayment: false,
					closeBtn: false,
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
		<div className="modal">
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
				style={{
					// width: '300px',
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
							border: '0.5px solid',
							borderColor: COLOURS.salmon,
							color: 'white',
							paddingTop: '8px',
							paddingBottom: '8px'
							// borderStyle: 'solid',
							// borderWidth: '2px'
						}}
					>
						{modalContent.progress ===
							Progress.awaitingMetamaskConfirm && (
							<CircularProgress
								size={24}
								style={{ marginRight: '8px' }}
								color={'primary'}
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
								size={24}
								style={{ marginRight: '8px' }}
							/>
							// </React.Fragment>
						)}
						<h5>{modalContent.progressText}</h5>
					</Grid>
				)}
				{txState !== TxState.cancelled &&
					txState !== TxState.inputError &&
					txState > TxState.displayLogIntoMetamask &&
					txState !== TxState.displayWrongNetwork && (
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
								border: '0.5px solid',
								borderColor: COLOURS.salmon,
								color: 'white'
							}}
						>
							<h4>Your Account</h4>
							<h4 style={{ marginLeft: 'auto' }}>
								{account
									? `${account.substring(
											0,
											6
									  )}...${account.substring(37, 41)}`
									: 'No acount found'}
							</h4>
						</Grid>
					)}
				{txState === TxState.postCreate &&
					txState > TxState.displayLogIntoMetamask && (
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
								border: '0.5px solid',
								borderColor: COLOURS.salmon,
								color: 'white'
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
									// color={'primary'}
									style={{ color: 'white' }}
									fontSize={'large'}
									// style={{ marginRight: '8px' }}
								/>
							</a>
							{/* <h4 style={{ marginLeft: 'auto' }}>0x232...fdf32</h4> */}
						</Grid>
					)}
				{/* Only show gelato prepayment between displayCreate and postCreate */}
				{modalContent.prepayment &&
					txState >= TxState.displayCreate &&
					txState < TxState.postCreate && (
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
								border: '0.5px solid',
								borderColor: COLOURS.salmon,
								color: 'white'
							}}
						>
							<h4>Gelato Fee</h4>
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
					txState !== TxState.cancelled &&
					txState !== TxState.inputError &&
					txState !== TxState.displayWrongNetwork &&
					txState > TxState.displayLogIntoMetamask && (
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
									border: '0.5px solid',
									borderColor: COLOURS.salmon,
									color: 'white'
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
									border: '0.5px solid',
									borderColor: COLOURS.salmon,
									color: 'white'
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
					// width: '300px',
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
								textAlign: 'center',
								padding: '16px',
								border: '0.5px solid',
								borderColor: COLOURS.salmon,
								// borderRadius: '1px 1px 1px 1px',
								color: 'white'
							}}
						>
							<h4 style={{ margin: '0px' }}>
								If the trigger{' '}
								<span style={{ color: COLOURS.salmon }}>
									{icedTxState.trigger.title}
								</span>{' '}
								is activated, your gelato bot will{' '}
								<span style={{ color: COLOURS.salmon }}>
									{icedTxState.action.title}
								</span>{' '}
								on your behalf
							</h4>
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
								marginTop: '40px',
								background: 'FFFFFF'
							}}
							color="primary"
							onClick={() => {
								const queryString = `I%20just%20tasked%20my%20gelato%20bot%20to%20${icedTxState.action.title}%20on%20my%20behalf%20when%20my%20predefined%20${icedTxState.trigger.title}%20trigger%20gets%20activated - via @gelatofinance`;
								console.log(queryString);
								const url = `https://twitter.com/intent/tweet?text=${queryString}`;
								window.open(url, '_blank');
							}}
						>
							<Button
								style={{
									width: '100%',
									border: '0.5px solid',
									borderColor: COLOURS.salmon,
									// borderRadius: '1px 1px 1px 1px',
									color: 'white'
								}}
							>
								Share on Twitter
							</Button>
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
								// background: 'FFFFFF',
								margin: '0px',
								color: 'white'
							}}
						>
							<h5
								style={{
									margin: '16px',
									fontFamily: 'PT Mono, monospace !important'
								}}
							>
								or
							</h5>
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
								background: 'FFFFFF'
								// marginTop: '40px'
							}}
						>
							<Button
								color="primary"
								onClick={() => {
									// Reset txState
									dispatch({
										type: CLOSE_MODAL
									});
									dispatch({
										type: UPDATE_TX_STATE,
										txState: TxState.displayLogIntoMetamask
									});
									history.push('/dashboard');
								}}
								style={{
									width: '100%',
									border: '0.5px solid',
									borderColor: COLOURS.salmon,
									// borderRadius: '1px 1px 1px 1px',
									color: 'white'
									// color: COLOURS.salmon
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
							color="primary"
							style={{
								width: '100%',
								border: '0.5px solid',
								borderColor: COLOURS.salmon,
								// borderRadius: '1px 1px 1px 1px',
								color: 'white'
								// color: COLOURS.salmon
							}}
							onClick={handleClick}
						>
							{modalContent.btn}
						</Button>
					</Grid>
				)}
				{/* Dont display close button for some of the modals*/}
				{modalContent.closeBtn && (
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
							color="primary"
							onClick={modalClose}
							style={{
								width: '100%',
								border: '0.5px solid',
								borderColor: COLOURS.salmon,
								// borderRadius: '1px 1px 1px 1px',
								color: 'white'
								// color: COLOURS.salmon
							}}
						>
							{txState === TxState.preCancel ||
							txState === TxState.displayCancel ||
							txState === TxState.postCancel
								? 'Close'
								: 'Cancel'}
						</Button>
					</Grid>
				)}
			</Grid>
		</div>
	);
}
