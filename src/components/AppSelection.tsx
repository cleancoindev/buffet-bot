import React, { Props, useEffect } from 'react';

// Routing
import { Link, useHistory } from 'react-router-dom';

// Context API
import { useIcedTxContext } from '../state/GlobalState';

// Material UI components
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import FlashOnOutlinedIcon from '@material-ui/icons/FlashOnOutlined';
import Typography from '@material-ui/core/Typography';

import { ATYPES, TTYPES } from '../constants/whitelist';

// Local components
import Dropdown from './Dropdown';

// Material UI
import { makeStyles } from '@material-ui/core/styles';

// Import Interfaces
import {
	ConditionOrAction,
	UserSelection,
	ActionWhitelistData,
	ConditionWhitelistData,
	TxState,
	ChainIds
} from '../constants/interfaces';
import {
	RESET_CONDITION,
	RESET_ACTION,
	COLOURS,
	BOX,
	UPDATE_TX_STATE,
	SELECTED_CHAIN_ID,
	OPEN_MODAL,
	CLOSE_MODAL,
	INPUT_OK
} from '../constants/constants';
import { useWeb3React } from '@web3-react/core';
import { checkIfMobile } from '../helpers/helpers';

const useStyles = makeStyles(theme => ({
	box: {
		...BOX
	},
	boxTitle: {
		fontSize: '18px',
		// fontWeight: 'bold',
		marginLeft: '10px',
		marginBottom: '0px',
		color: 'white',
		textAlign: 'left'
	},
	createButton: {
		fontSize: '18px',

		background: COLOURS.salmon60,
		minWidth: '100px',
		color: 'white',
		border: 0,
		borderRadius: 3,
		boxShadow: '0 1.5px 1.5px 1.5px rgba(255, 255, 255, .3)',
		height: 48,
		padding: '0 20px',
		margin: 8,
		// marginBottom: '40px',
		'&:hover': {
			background: COLOURS.salmon
		}
	}
}));

export default function AppSelection() {
	const classes = useStyles();
	// Import global state
	//const { updateIcedTx, icedTxState, resetIcedTxInput } = useIcedTxContext();
	const { icedTxState, dispatch } = useIcedTxContext();

	const web3 = useWeb3React();

	const history = useHistory();

	// Import Web3react Context
	// useEffect(() => {}, []);

	const availableConditions = [...TTYPES];
	const availableActions = [...ATYPES];

	useEffect(() => {
		// IF metamask is not logged in, but TxState already advanced to beyond displaylOgIntoMetamsk (User logged in and then out) => then revert back to displayLogIntoMetamask state
		checkIfMobile();
		if (
			!web3.active &&
			icedTxState.txState > TxState.displayLogIntoMetamask
		) {
			dispatch({
				type: UPDATE_TX_STATE,
				txState: TxState.displayLogIntoMetamask
			});
		} else {
			preTxCheck();
		}
	}, [icedTxState.txState, web3.active, web3.chainId]);

	// ON Mounting, set error to False

	useEffect(() => {
		if (icedTxState.error.isError) {
			console.log('Setting Error to false in AppSelection');
			dispatch({
				type: INPUT_OK,
				txState: TxState.displayInstallMetamask
			});
		}
	}, []);

	const preTxCheck = () => {
		const { ethereum } = window as any;
		switch (icedTxState.txState) {
			case TxState.displayMobile:
				if (!checkIfMobile()) {
					// console.log('user on desktop');
					// Change txState to "Login with metamask"
					// console.log('Change TxState to displayLogIntoMetamask');
					dispatch({
						type: UPDATE_TX_STATE,
						txState: TxState.displayInstallMetamask
					});
				} else {
					if (typeof ethereum !== 'undefined') {
						// Check if the object is injected by metamask
						if (ethereum.isMetaMask) {
							// Yes it is metamask
							// console.log('User uses metamask mobile app');
							// Change txState to "Login with metamask"
							// console.log('Change TxState to displayLogIntoMetamask');
							dispatch({
								type: UPDATE_TX_STATE,
								txState: TxState.displayLogIntoMetamask
							});
						} else {
							// No Metamask installed => Show install Metamask Modal
							// console.log(
							// 	'No Metamask is installed - Render no mobile modal'
							// 	// No need to change icedTx.txState
							// );
						}
					}
					// console.log('User on mobile');
				}
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
						// // No Metamask installed => Show install Metamask Modal
						// console.log(
						// 	'No Metamask is installed - Render Install metamask modal'
						// 	// No need to change icedTx.txState
						// );
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
					if ((web3.chainId as ChainIds) !== SELECTED_CHAIN_ID) {
						// No Metamask installed => Show install Metamask Modal
						dispatch({
							type: UPDATE_TX_STATE,
							txState: TxState.displayWrongNetwork
						});
					} else {
						// console.log('User is active and on the right network');
					}
					// console.log('User has to log into metamask');
				} else {
				}

				break;

			// 3. Check if user is connected to the correct network
			case TxState.displayWrongNetwork:
				// User is already logged in => Change to insufficientBalance
				if (web3.chainId === SELECTED_CHAIN_ID) {
					// console.log('Change TxState to insufficientBalance');
					dispatch({
						type: UPDATE_TX_STATE,
						txState: TxState.displayLogIntoMetamask
					});
				} else {
					// No Metamask installed => Show install Metamask Modal
					// console.log('User has to switch networks');
				}

				break;
		}
	};

	return (
		<div /*className={classes.box}*/>
			{/* <h1>{`Instruct a conditional transaction by defining a condition and action`}</h1> */}
			<Grid
				container
				direction="row"
				justify="space-between"
				alignItems="center"
				// style={{ padding: '16px' }}
			>
				<Grid
					container
					item
					md={5}
					sm={5}
					xs={12}
					direction="column"
					justify="space-evenly"
					alignItems="stretch"
					style={{}}
				>
					<Grid
						container
						item
						justify="flex-start"
						className={classes.box}
					>
						<p className={classes.boxTitle}>Condition</p>
						<Dropdown
							// userSelection={userSelection}
							conditionOrAction={ConditionOrAction.Condition}
							data={availableConditions}
							// updateConditionOrAction={updateConditionOrAction}
						/>
					</Grid>
					{/* <Grid container item justify="flex-start" style={{background: "yellow"}}>
                    <Dropdown/>
                </Grid> */}
				</Grid>
				<Grid
					container
					item
					md={2}
					sm={2}
					xs={12}
					direction="column"
					justify="center"
					alignItems="center"
					style={{}}
				>
					<Hidden xsDown>
						<ArrowForwardIcon fontSize="large" />
					</Hidden>
					<Hidden smUp>
						<ArrowDownwardIcon
							style={{ marginTop: '8px', marginBottom: '8px' }}
							fontSize="large"
						/>
					</Hidden>
				</Grid>
				<Grid
					container
					item
					md={5}
					sm={5}
					xs={12}
					direction="column"
					justify="space-evenly"
					alignItems="stretch"
					style={{}}
				>
					<Grid
						container
						item
						justify="flex-start"
						className={classes.box}
					>
						<p className={classes.boxTitle}>Action</p>
						<Dropdown
							// userSelection={userSelection}
							conditionOrAction={ConditionOrAction.Action}
							data={availableActions}
							// updateConditionOrAction={updateConditionOrAction}
						/>
					</Grid>
				</Grid>
			</Grid>
			<Divider variant="middle" />

			{icedTxState.condition.id !== 0 && icedTxState.action.id !== 0 && (
				<React.Fragment>
					<Grid
						container
						item
						xs={12}
						direction="row"
						justify="space-evenly"
						alignItems="stretch"
						style={{
							marginTop: '40px'
						}}
					>
						{/* <div
							style={{
								textAlign: 'justify',
								textAlignLast: 'center',
								fontSize: '18px'
							}}
						>
							Your gelato bot will{' '}
							<span style={{ color: '#E50078' }}>
								{icedTxState.action.title}
							</span>{' '}
							on your behalf, when the condition{' '}
							<span style={{ color: '#E50078' }}>
								{icedTxState.condition.title}{' '}
							</span>
							is activated
						</div> */}
						<div
							style={{
								textAlign: 'justify',
								textAlignLast: 'center',
								fontSize: '18px'
							}}
						>
							Your gelato bot will be monitoring your specified{' '}
							<span style={{ color: COLOURS.salmon }}>
								{icedTxState.condition.title}
							</span>{' '}
							and, if the details of your condition are fulfilled,
							it will{' '}
							<span style={{ color: COLOURS.salmon }}>
								{icedTxState.action.title}
							</span>{' '}
							on your behalf.
						</div>
						{/* <h2
							style={{
								textAlign: 'justify',,
								fontSize: '18px'
								textAlignLast: 'center'
							}}
						>
							Your gelato bot will{' '}
							<span style={{ color: '#E50078' }}>
								{icedTxState.action.title}
							</span>{' '}
							on your behalf, when the condition{' '}
							<span style={{ color: '#E50078' }}>
								{icedTxState.condition.title}{' '}
							</span>
							is activated
						</h2> */}
					</Grid>
					<Grid
						container
						item
						xs={12}
						direction="row"
						justify="space-evenly"
						alignItems="stretch"
						style={{
							marginTop: '24px'
						}}
					>
						{icedTxState.txState ===
							TxState.displayWrongNetwork && (
							<Button
								className={classes.createButton}
								endIcon={<FlashOnOutlinedIcon />}
								onClick={() =>
									// Open Modal
									dispatch({
										type: OPEN_MODAL
									})
								}
							>
								Instruct Bot
							</Button>
						)}
						{icedTxState.txState !== TxState.displayWrongNetwork &&
							web3.active && (
								<Button
									onClick={() => {
										history.push(
											`instruct/${icedTxState.condition.id}/${icedTxState.action.id}`
										);
										dispatch({
											type: UPDATE_TX_STATE,
											txState: TxState.insufficientBalance
										});
									}}
									className={classes.createButton}
									endIcon={<FlashOnOutlinedIcon />}
								>
									Instruct Bot
								</Button>
							)}
						{icedTxState.txState !== TxState.displayWrongNetwork &&
							!web3.active && (
								<Button
									endIcon={<FlashOnOutlinedIcon />}
									onClick={() =>
										dispatch({ type: OPEN_MODAL })
									}
									className={classes.createButton}
								>
									Instruct Bot
								</Button>
							)}
					</Grid>
				</React.Fragment>
			)}
		</div>
	);
}
