import React, { Props, useEffect } from 'react';

// Routing
import { Link } from 'react-router-dom';

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

import { ATYPES, TTYPES } from '../constants/whitelist';

// Local components
import Dropdown from './Dropdown';

// Material UI
import { makeStyles } from '@material-ui/core/styles';

// Import Interfaces
import {
	TriggerOrAction,
	UserSelection,
	ActionWhitelistData,
	TriggerWhitelistData,
	TxState
} from '../constants/interfaces';
import {
	RESET_CONDITION,
	RESET_ACTION,
	COLOURS,
	BOX,
	UPDATE_TX_STATE,
	SELECTED_CHAIN_ID,
	OPEN_MODAL
} from '../constants/constants';
import { useWeb3React } from '@web3-react/core';

const useStyles = makeStyles(theme => ({
	box: {
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
		boxShadow: '0 1.5px 1.5px 1.5px rgba(255, 255, 255, .3)',
		height: 48,
		padding: '0 20px',
		margin: 8,
		// marginBottom: '40px',
		'&:hover': {
			background: COLOURS.salmon60
		}
	}
}));

export default function AppSelection() {
	const classes = useStyles();
	// Import global state
	//const { updateIcedTx, icedTxState, resetIcedTxInput } = useIcedTxContext();
	const { icedTxState, dispatch } = useIcedTxContext();

	const web3 = useWeb3React();

	// Import Web3react Context
	// useEffect(() => {}, []);

	const availableTriggers = [...TTYPES];
	const availableActions = [...ATYPES];

	useEffect(() => {
		preTxCheck();
	}, [icedTxState.txState, web3.active, web3.chainId]);

	const preTxCheck = () => {
		const { ethereum } = window as any;
		if (!web3.active) {
			dispatch({
				type: UPDATE_TX_STATE,
				txState: TxState.displayLogIntoMetamask
			});
			return 0;
		}
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
		}
	};

	return (
		<div /*className={classes.box}*/>
			{/* <h1>{`Create a conditional transaction by defining a trigger and action`}</h1> */}
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
						<p className={classes.boxTitle}>Trigger</p>
						<Dropdown
							// userSelection={userSelection}
							triggerOrAction={TriggerOrAction.Trigger}
							data={availableTriggers}
							// updateTriggerOrAction={updateTriggerOrAction}
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
							triggerOrAction={TriggerOrAction.Action}
							data={availableActions}
							// updateTriggerOrAction={updateTriggerOrAction}
						/>
					</Grid>
				</Grid>
			</Grid>
			<Divider variant="middle" />

			{icedTxState.trigger.id !== 0 && icedTxState.action.id !== 0 && (
				<React.Fragment>
					<Grid
						container
						item
						xs={12}
						direction="row"
						justify="space-evenly"
						alignItems="stretch"
						style={{
							marginTop: '32px'
						}}
					>
						<h2
							style={{
								textAlign: 'justify',
								textAlignLast: 'center'
							}}
						>
							Gelato will{' '}
							<span style={{ color: '#E50078' }}>
								{icedTxState.action.title}
							</span>{' '}
							on your behalf, when the trigger{' '}
							<span style={{ color: '#E50078' }}>
								{icedTxState.trigger.title}{' '}
							</span>
							is activated
						</h2>
					</Grid>
					<Grid
						container
						item
						xs={12}
						direction="row"
						justify="space-evenly"
						alignItems="stretch"
						style={{
							marginTop: '16px'
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
								Create
							</Button>
						)}
						{icedTxState.txState !== TxState.displayWrongNetwork &&
							web3.active && (
								<Link
									to={`create/${icedTxState.trigger.id}/${icedTxState.action.id}`}
									style={{ textDecoration: 'none' }}
								>
									<Button
										className={classes.createButton}
										endIcon={<FlashOnOutlinedIcon />}
									>
										Create
									</Button>
								</Link>
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
									Create
								</Button>
							)}
					</Grid>
				</React.Fragment>
			)}
		</div>
	);
}
