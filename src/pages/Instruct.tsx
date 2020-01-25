import React, { useState, useEffect } from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

// Local Components
import Stepper from '../components/Stepper';
import MobileStepper from '../components/MobileStepper';

// Types
import { RouteComponentProps } from 'react-router-dom';
import { useIcedTxContext } from '../state/GlobalState';
import { findConditionById, findActionById } from '../helpers/helpers';
import {
	SELECT_CONDITION,
	SELECT_ACTION,
	UPDATE_TX_STATE,
	OPEN_MODAL,
	CLOSE_MODAL,
	SELECTED_CHAIN_ID,
	BOX
} from '../constants/constants';
import TransactionModal from '../components/Modal';
import { TxState, ChainIds } from '../constants/interfaces';
import { Web3Provider } from 'ethers/providers';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

import ERC20_ABI from '../constants/abis/erc20.json';

import { useGelatoCore } from '../hooks/hooks';

interface Params {
	conditionId: string;
	actionId: string;
}

// interface Match extends RouteComponentProps<Params> {}

export default function Instruct({ match }: RouteComponentProps<Params>) {
	const {
		params: { conditionId, actionId }
	} = match;
	const { icedTxState, dispatch } = useIcedTxContext();

	// web3React context
	const web3 = useWeb3React();

	web3.connector?.getProvider();

	// Returns true if wrong params were inputted in URL
	const [notFound, setNotFound] = useState(false);

	// Get gelatoCore
	const gelatoCore = useGelatoCore();

	// console.log(icedTxState.txState);

	// When component renders, 1) Check that icedTx state exist, if not 2) check if correct params were inputted in URL, if not, 3) setNotFound = true
	useEffect(() => {
		if (icedTxState.condition.id === 0 || icedTxState.action.id === 0) {
			// See if inputted params in URL exist in whitelist
			// console.log(conditionId, actionId)
			const paramCondition = findConditionById(conditionId);
			const paramAction = findActionById(actionId);
			// console.log(paramCondition)
			// console.log(paramAction)
			if (paramCondition.id === 0 || paramAction.id === 0) {
				// Render IcedTx not found
				setNotFound(true);
			} else {
				// updateIcedTx(
				// 	ConditionOrAction.Condition,
				// 	paramCondition.id.toString()
				// );
				dispatch({
					type: SELECT_CONDITION,
					id: paramCondition.id.toString()
				});
				// updateIcedTx(
				// 	ConditionOrAction.Action,
				// 	paramAction.id.toString()
				// );
				dispatch({
					type: SELECT_ACTION,
					id: paramAction.id.toString()
				});
			}
		}
	}, []);

	// IF ICEDTXSTATE == 0 => Use from query string. If still zero, render Confiugrator

	// Stepper State
	const [activeStep, setActiveStep] = React.useState(0);
	// const steps = getSteps();

	// Stepper Functions
	function handleNext() {
		// @ DEV INCLUDE VALIDATION, ONLY ALLOW IF ALL INPUT FIELDS HAVE BEEN VALIDATED
		if (!icedTxState.error.isError) {
			setActiveStep(prevActiveStep => prevActiveStep + 1);
		} else {
			// Open Modal and show error
			console.log('openModal');
			dispatch({ type: OPEN_MODAL });
		}
	}

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	function getSteps() {
		return ['Set Condition', 'Set Action', 'Submit Instruction'];
	}

	// ########################### Checks before minting
	const preTxCheck = () => {
		console.log('in here');
		// 1. Check if user has metamask installed, if not display install metamask link
		const { ethereum } = window as any;

		switch (icedTxState.txState) {
			case TxState.displayInstallMetamask:
				// Web3 object is injected
				if (typeof ethereum !== 'undefined') {
					// Check if the object is injected by metamask
					if (ethereum.isMetaMask) {
						// Yes it is metamask
						// console.log('Metamask is installed');
						// Change txState to "Login with metamask"
						// console.log('Change TxState to displayLogIntoMetamask');
						dispatch({
							type: UPDATE_TX_STATE,
							txState: TxState.displayLogIntoMetamask
						});
					} else {
						// No Metamask installed => Show install Metamask Modal
						console.log(
							'No Metamask is installed - Render Install metamask modal'
							// No need to change icedTx.txState
						);
					}
				} else {
					// No ethereum provider => Still install metamask
				}
				break;

			// 2. Check if user is logged into metamask and has approved gelato
			case TxState.displayLogIntoMetamask:
				// User is already logged in => Change to insufficientBalance
				if (web3.active) {
					// Check if the object is injected by metamask
					// console.log('Change TxState to displayWrongNetwork');
					dispatch({
						type: UPDATE_TX_STATE,
						txState: TxState.displayWrongNetwork
					});
				} else {
					// No Metamask installed => Show install Metamask Modal
					// console.log('User has to log into metamask');
				}

				break;

			// 3. Check if user is connected to the correct network
			case TxState.displayWrongNetwork:
				// User is already logged in => Change to insufficientBalance
				if (web3.chainId === SELECTED_CHAIN_ID) {
					// Check if the object is injected by metamask
					// console.log('Change TxState to insufficientBalance');
					dispatch({
						type: UPDATE_TX_STATE,
						txState: TxState.insufficientBalance
					});
				} else {
					// No Metamask installed => Show install Metamask Modal
					console.log('User has to switch networks');
				}

				break;

			// 4. Check if user has sufficient ETH Balance
			case TxState.insufficientBalance:
				// User is already logged in => Change to insufficientBalance
				web3.library
					.getBalance(web3.account)
					.then((result: ethers.utils.BigNumber) => {
						const userBalance = result;
						// $0.2
						const hypotheticalMintingCosts = ethers.utils.bigNumberify(
							'1200000000000000'
						);
						// We make initial check that user has sufficient ETH, e.g. more than 0.01ETH => Balance greater than cost of minting
						if (hypotheticalMintingCosts.lte(userBalance)) {
							// Change txState to displayGelatoWallet
							// console.log(
							// 	'Change TxState to displayGelatoWallet'
							// );
							dispatch({
								type: UPDATE_TX_STATE,
								txState: TxState.displayGelatoWallet
							});
						} else {
							console.log('User has insufficient balance');
						}
					});
				break;

			// 5. Check if user has gelato proxy
			case TxState.displayGelatoWallet:
				// User is already logged in => Change to insufficientBalance
				// console.log('Checking if user is registered');
				gelatoCore.isUser(web3.account).then((result: boolean) => {
					const isUser = result;
					// User has Proxy
					if (isUser) {
						// console.log('Change TxState to displayApprove');
						dispatch({
							type: UPDATE_TX_STATE,
							txState: TxState.displayApprove
						});
					}
				});

				// let proxyAddress = await gelatoCore.useProxyOfUser(context.account)
				break;
			// 6. Display Approve
			case TxState.displayApprove:
				if (activeStep === 2) {
					// User is already logged in => Change to insufficientBalance
					gelatoCore
						.proxyByUser(web3.account)
						.then((result: string) => {
							const proxyAddress = result;
							// User has Proxy
							// @DEV Make dynamic
							const tokenAmount = ethers.utils.bigNumberify(
								'10000000000000000'
							);
							// Get Erc20 contract
							const signer = web3.library.getSigner();
							const tokenAddress =
								icedTxState.action.userInputs[
									icedTxState.action.approveIndex
								];
							const erc20 = new ethers.Contract(
								tokenAddress.toString(),
								JSON.stringify(ERC20_ABI),
								signer
							);
							erc20
								.allowance(web3.account, proxyAddress)
								.then((result: ethers.utils.BigNumber) => {
									const allowance = result;
									console.log('Allowance: ');
									console.log(allowance.toString());
									// If the Allowance is greater than the selected token amount, move on
									if (tokenAmount.lte(allowance)) {
										console.log(
											'Change TxState to displayCreate'
										);
										dispatch({
											type: UPDATE_TX_STATE,
											txState: TxState.displayCreate
										});
									} else {
										console.log('Insufficient allowance');
									}
									// User has Proxy
								});
						});
				}
				break;
			default:
				// console.log('default');
				if (
					icedTxState.txState === TxState.displayCancel ||
					icedTxState.txState === TxState.preCancel ||
					icedTxState.txState === TxState.postCancel
				) {
					console.log('User wanted to cancel, refresh txState');
					dispatch({
						type: UPDATE_TX_STATE,
						txState: TxState.displayInstallMetamask
					});
				}
				break;
		}
	};

	const modalOpen = icedTxState.modalOpen;
	const modalClickOpen = () => {
		// console.log('setting modal to true');
		dispatch({ type: OPEN_MODAL });
	};
	const modalClose = () => {
		dispatch({ type: CLOSE_MODAL });
	};

	useEffect(() => {
		if (icedTxState.error.isError) {
			dispatch({
				type: UPDATE_TX_STATE,
				txState: TxState.inputError
			});
		} else {
			preTxCheck();
		}
	}, [icedTxState.txState, web3.active, activeStep, web3.account]);

	// MODAL STUFF END

	return (
		<div
			className="content"
			style={{ ...BOX, margin: '0', padding: '40px' }}
		>
			<Grid
				container
				direction="row"
				justify="center"
				alignItems="center"
			>
				{!notFound && (
					<React.Fragment>
						<Hidden xsDown>
							<Stepper
								preTxCheck={preTxCheck}
								icedTxState={icedTxState}
								steps={getSteps()}
								activeStep={activeStep}
								handleNext={handleNext}
								handleBack={handleBack}
								handleReset={handleReset}
								modalOpen={modalOpen}
								modalClickOpen={modalClickOpen}
								modalClose={modalClose}
							></Stepper>
						</Hidden>
						<Hidden smUp>
							<MobileStepper
								preTxCheck={preTxCheck}
								icedTxState={icedTxState}
								steps={getSteps()}
								activeStep={activeStep}
								handleNext={handleNext}
								handleBack={handleBack}
								handleReset={handleReset}
								modalOpen={modalOpen}
								modalClickOpen={modalClickOpen}
								modalClose={modalClose}
							></MobileStepper>
						</Hidden>
					</React.Fragment>
				)}

				{notFound && (
					<h1> 404 - Page not found. Please return to homepage</h1>
				)}
			</Grid>
			{/* <TransactionModal
				modalOpen={modalOpen}
				modalClickOpen={modalClickOpen}
				modalClose={modalClose}
				icedTxState={icedTxState}
			></TransactionModal> */}
		</div>
	);
}
