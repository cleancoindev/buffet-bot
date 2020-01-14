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
	BOX
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
	const { icedTxState } = useIcedTxContext();

	// Import Web3react Context
	// useEffect(() => {}, []);

	const availableTriggers = [...TTYPES];
	const availableActions = [...ATYPES];

	return (
		<div /*className={classes.box}*/>
			{/* <h1>{`Create a conditional transaction by defining a trigger and action`}</h1> */}
			<Grid
				container
				direction="row"
				justify="space-between"
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
				>
					<Grid
						container
						item
						justify="flex-start"
						className={classes.box}
					>
						<p className={classes.boxTitle}>Trigger</p>
						<Dropdown
							app={false}
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
					sm={4}
					xs={12}
					direction="column"
					justify="space-evenly"
					alignItems="stretch"
				>
					<Grid
						container
						item
						justify="flex-start"
						className={classes.box}
					>
						<p className={classes.boxTitle}>Action</p>
						<Dropdown
							app={false}
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
						style={
							{
								// marginTop: '16px'
							}
						}
					>
						<h2 style={{ textAlign: 'center' }}>
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
							<Link
								to={`create/${icedTxState.trigger.id}/${icedTxState.action.id}`}
								style={{ textDecoration: 'none' }}
							>
								<Button className={classes.createButton}>
									Create
								</Button>
							</Link>
						)}
					</Grid>
				</React.Fragment>
			)}
		</div>
	);
}
