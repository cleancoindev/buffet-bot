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
	UPDATE_TX_STATE
} from '../constants/constants';
import TransactionModal from '../components/Modal';
import { TxState } from '../constants/interfaces';
import { Web3Provider } from 'ethers/providers';
import { useWeb3React } from '@web3-react/core';

interface Params {
	conditionId: string;
	actionId: string;
}

// interface Match extends RouteComponentProps<Params> {}

export default function Create({ match }: RouteComponentProps<Params>) {
	const {
		params: { conditionId, actionId }
	} = match;
	const { icedTxState, dispatch } = useIcedTxContext();

	// web3React context
	const web3 = useWeb3React();

	// Returns true if wrong params were inputted in URL
	const [notFound, setNotFound] = useState(false);

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
		setActiveStep(prevActiveStep => prevActiveStep + 1);
	}

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
	};

	function getSteps() {
		return ['Set Condition', 'Set Action', 'Create IcedTx'];
	}

	// MODAL STUFF

	// Modal Stuff
	const [modalOpen, setModalOpen] = React.useState(false);

	const modalClickOpen = () => {
		setModalOpen(true);
	};

	const modalClose = () => {
		setModalOpen(false);
	};

	console.log(web3.library);

	// ########################### Checks before minting
	const preTxCheck = () => {
		// 1. Check if user has metamask installed, if not display install metamask link
		const { ethereum } = window as any;

		switch (icedTxState.txState) {
			case TxState.displayInstallMetamask:
				// Web3 object is injected
				if (typeof ethereum !== 'undefined') {
					// Check if the object is injected by metamask
					if (ethereum.isMetaMask) {
						// Yes it is metamask
						console.log('Metamask is installed');
						// Change txState to "Login with metamask"
						console.log('Change TxState to displayLogIntoMetamask');
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
					console.log('Change TxState to insufficientBalance');
					dispatch({
						type: UPDATE_TX_STATE,
						txState: TxState.insufficientBalance
					});
				} else {
					// No Metamask installed => Show install Metamask Modal
					console.log('User has to log into metamask');
				}

				break;

			// 3. Check if user has sufficient ETH Balance
			case TxState.insufficientBalance:
				// User is already logged in => Change to insufficientBalance
				web3.library.getBalance(web3.account).then((result: string) => {
					console.log(result);
				});
				// if (web3.active) {
				// 	// Check if the object is injected by metamask
				// 	console.log('Change TxState to insufficientBalance');
				// 	dispatch({
				// 		type: UPDATE_TX_STATE,
				// 		txState: TxState.insufficientBalance
				// 	});
				// } else {
				// 		// No Metamask installed => Show install Metamask Modal
				// 		console.log(
				// 			'User has to log into metamask'
				// 		);
				// }
				break;
		}

		// 4. Check if user has gelato proxy

		// 5. Check if user has sufficient token approval

		// 6. READY to mint
	};

	useEffect(() => {
		preTxCheck();
	}, [icedTxState.txState]);

	// MODAL STUFF END

	return (
		<React.Fragment>
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
			<TransactionModal
				txState={icedTxState.txState}
				title={'Confirm in Metamask'}
				modalOpen={modalOpen}
				modalClickOpen={modalClickOpen}
				modalClose={modalClose}
				icedTxState={icedTxState}
			></TransactionModal>
		</React.Fragment>
	);
}
