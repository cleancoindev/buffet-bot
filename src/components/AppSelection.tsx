import React, { Props } from 'react';

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

import { ATYPES, CTYPES } from '../constants/whitelist';

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
import { RESET_CONDITION, RESET_ACTION, COLOURS } from '../constants/constants';
import { useWeb3React } from '@web3-react/core';

const useStyles = makeStyles(theme => ({
	box: {
		background: 'black',
		// border: '3px outset #E50078',
		border: `3px outset ${COLOURS.salmon}`,

		borderRadius: '2px 2px 2px 2px'
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

export default function AppSelection() {
	const classes = useStyles();
	// Import global state
	//const { updateIcedTx, icedTxState, resetIcedTxInput } = useIcedTxContext();
	const { dispatch, icedTxState } = useIcedTxContext();

	// Import Web3react Context
	const web3 = useWeb3React();
	// console.log(web3);

	// Local State
	const [userSelection, setUserSelection] = React.useState<UserSelection>({
		triggerApp: '',
		actionApp: '',
		triggerAppFunctions: [],
		actionAppFunctions: []
	});

	// console.log(userSelection);

	function updateTriggerOrAction(
		selectedTriggerOrAction: TriggerOrAction,
		app: string
	) {
		// console.log(app);
		const result: Array<ActionWhitelistData | TriggerWhitelistData> = [];
		const triggerOrAction = { app: '', type: '' };
		if (selectedTriggerOrAction === TriggerOrAction.Trigger) {
			CTYPES.forEach(type => {
				if (type.app === app) {
					result.push(type);
				}
			});
			triggerOrAction.app = 'triggerApp';
			triggerOrAction.type = 'triggerAppFunctions';
			// resetIcedTxInput(TriggerOrAction.Trigger);
			// RESET THE CONDITION to SELECT...
			dispatch({ type: RESET_CONDITION });
		} else {
			ATYPES.forEach(type => {
				if (type.app === app) {
					result.push(type);
				}
			});
			triggerOrAction.app = 'actionApp';
			triggerOrAction.type = 'actionAppFunctions';
			// resetIcedTxInput(TriggerOrAction.Action);
			// RESET THE CONDITION to SELECT...
			dispatch({ type: RESET_ACTION });
		}
		setUserSelection({
			...userSelection,
			[triggerOrAction.app]: app,
			[triggerOrAction.type]: result
		});
	}

	return (
		<div className={classes.box}>
			<h1>{`Automate sending transactions to ethereum dapps with gelato`}</h1>
			<Grid
				container
				direction="row"
				justify="space-evenly"
				alignItems="center"
				style={{ padding: '16px' }}
			>
				<Grid
					container
					item
					sm={4}
					xs={12}
					direction="column"
					justify="space-evenly"
					alignItems="stretch"
					style={{
						height: '200px'
					}}
				>
					<Grid
						container
						item
						justify="flex-start"
						className={classes.box}
					>
						<p className={classes.boxTitle}>Listen to this dApp</p>
						<Dropdown
							app
							// userSelection={userSelection}
							triggerOrAction={TriggerOrAction.Trigger}
							data={CTYPES}
							updateTriggerOrAction={updateTriggerOrAction}
						/>
					</Grid>
					{/* <Grid container item justify="flex-start" style={{background: "yellow"}}>
                    <Dropdown/>
                </Grid> */}
				</Grid>
				<Grid
					container
					item
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
						<ArrowDownwardIcon fontSize="large" />
					</Hidden>
				</Grid>
				<Grid
					container
					item
					sm={4}
					xs={12}
					direction="column"
					justify="space-evenly"
					alignItems="stretch"
					style={{ height: '200px' }}
				>
					<Grid
						container
						item
						justify="flex-start"
						className={classes.box}
					>
						<p className={classes.boxTitle}>
							Send Transaction to this dApp
						</p>
						<Dropdown
							app
							// userSelection={userSelection}
							triggerOrAction={TriggerOrAction.Action}
							data={ATYPES}
							updateTriggerOrAction={updateTriggerOrAction}
						/>
					</Grid>
				</Grid>
			</Grid>
			<Divider variant="middle" />
			{userSelection.triggerApp !== '' && userSelection.actionApp !== '' && (
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
						sm={4}
						xs={12}
						direction="column"
						justify="space-evenly"
						alignItems="stretch"
						style={{ height: '200px' }}
					>
						<Grid
							container
							item
							justify="flex-start"
							className={classes.box}
						>
							<p className={classes.boxTitle}>Select Trigger</p>
							<Dropdown
								app={false}
								// userSelection={userSelection}
								triggerOrAction={TriggerOrAction.Trigger}
								data={userSelection.triggerAppFunctions}
								updateTriggerOrAction={updateTriggerOrAction}
							/>
						</Grid>
					</Grid>
					<Grid
						container
						item
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
							<ArrowDownwardIcon fontSize="large" />
						</Hidden>
					</Grid>
					<Grid
						container
						item
						sm={4}
						xs={12}
						direction="column"
						justify="space-evenly"
						alignItems="stretch"
						style={{ height: '200px' }}
					>
						<Grid
							container
							item
							justify="flex-start"
							className={classes.box}
						>
							<p className={classes.boxTitle}>Select Action</p>
							<Dropdown
								app={false}
								// userSelection={userSelection}
								triggerOrAction={TriggerOrAction.Action}
								data={userSelection.actionAppFunctions}
								updateTriggerOrAction={updateTriggerOrAction}
							/>
						</Grid>
					</Grid>
					{userSelection.triggerApp !== '' &&
						userSelection.actionApp !== '' &&
						icedTxState.trigger.id !== 0 &&
						icedTxState.action.id !== 0 && (
							<React.Fragment>
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
									<h2 style={{ textAlign: 'center' }}>
										Gelato will{' '}
										<span style={{ color: '#E50078' }}>
											{icedTxState.action.title}
										</span>{' '}
										with{' '}
										<span style={{ color: '#E50078' }}>
											{icedTxState.action.app}
										</span>{' '}
										on your behalf, when the trigger{' '}
										<span style={{ color: '#E50078' }}>
											{icedTxState.trigger.title}{' '}
										</span>
										on{' '}
										<span style={{ color: '#E50078' }}>
											{icedTxState.trigger.app}
										</span>{' '}
										is fulfilled
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
										<Link
											to={`create/${icedTxState.trigger.id}/${icedTxState.action.id}`}
											style={{ textDecoration: 'none' }}
										>
											<Button
												className={classes.createButton}
												disabled
											>
												Create
											</Button>
										</Link>
									)}
									{icedTxState.txState !==
										TxState.displayWrongNetwork && (
										<Button
											className={classes.createButton}
											disabled
										>
											Create
										</Button>
									)}
								</Grid>
							</React.Fragment>
						)}
				</Grid>
			)}
		</div>
	);
}
