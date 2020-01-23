import React, { useEffect } from 'react';

// Routing
import { useHistory } from 'react-router-dom';

// Material UI
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Divider from '@material-ui/core/Divider';
import WarningIcon from '@material-ui/icons/Warning';

// Web3 React
import { useWeb3React } from '@web3-react/core';
import { useEagerConnect, useInactiveListener } from '../hooks/hooks';
import { injected } from '../constants/connectors';
import {
	COLOURS,
	SELECTED_CHAIN_ID,
	UPDATE_TX_STATE,
	OPEN_MODAL,
	RESET_CONDITION,
	RESET_ACTION,
	SELECT_CONDITION,
	DEFAULT_TRIGGER_ID,
	INPUT_OK
} from '../constants/constants';
import { useIcedTxContext } from '../state/GlobalState';
import { TxState } from '../constants/interfaces';
import GelatoLogo from './Logo/Logo';

const drawerWidth = 240;

const BootstrapButtonDanger = withStyles({
	root: {
		boxShadow: 'none',
		textTransform: 'none',
		fontSize: 16,
		padding: '6px 12px',
		border: '1px solid',
		marginLeft: '16px',
		lineHeight: 1.5,
		borderColor: 'red',
		backgroundColor: 'red',
		color: 'white',

		'&:hover': {
			backgroundColor: 'red',
			borderColor: 'red',
			boxShadow: 'none'
		}
		// '&:focus': {
		// 	boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)'
		// }
	}
})(Button);

const BootstrapButton = withStyles({
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

const useStyles = makeStyles(theme => ({
	appBar: {
		background: 'transparent',
		paddingTop: '16px'
	},
	menuButton: {
		marginRight: 'auto',
		textDecoration: 'none',
		color: 'white',
		cursor: 'pointer',
		'&:hover': { color: COLOURS.salmon },
		display: 'flex',
		flexDirection: 'row',
		justify: 'center',
		alignItems: 'center'
	},
	title: {
		flexGrow: 1
	},
	rightSide: {
		marginLeft: 'auto'
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth,
		background: 'black'
	},
	drawerHeader: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 1),
		...theme.mixins.toolbar,
		justifyContent: 'flex-start'
	}
}));

export default function ButtonAppBar() {
	const classes = useStyles();
	const theme = useTheme();
	const history = useHistory();
	const [mobileOpen, setMobileOpen] = React.useState(false);
	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen);
	};

	const { account, active, activate, chainId } = useWeb3React();
	const { dispatch } = useIcedTxContext();

	// Web3 Logic

	// Set default selected Trigger, as header only gets mounted once
	useEffect(() => {
		console.log('Mount header');
		const functionId = DEFAULT_TRIGGER_ID;
		dispatch({ type: SELECT_CONDITION, id: functionId });
	}, []);

	// handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
	const triedEager = useEagerConnect();

	// handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
	useInactiveListener(!triedEager);

	const logInLogOutMetamask = async () => {
		if (!active) {
			await activate(injected);
		}
	};

	// Web3 Logic END

	return (
		<React.Fragment>
			<AppBar className={classes.appBar} position="static">
				<Toolbar style={{ paddingLeft: '0px', paddingRight: '0px' }}>
					{/* <Link className={classes.menuButton} to="/"> */}
					<div className={classes.menuButton}>
						{/* <img
							src={`${process.env.PUBLIC_URL}/images/gelato_logo.png`}
							alt="logo"
							style={{
								width: '40px',
								marginRight: '8px'
							}}
						/> */}
						<GelatoLogo></GelatoLogo>

						<Typography
							style={{ paddingBottom: '6px' }}
							variant="h5"
						>
							gelato finance
						</Typography>
					</div>
					{/* </Link> */}
					<Hidden smDown>
						{active && chainId === SELECTED_CHAIN_ID && (
							<BootstrapButton
								style={{ border: 'none' }}
								onClick={() => {
									// First refresh state of Create Page to start from the beginning
									dispatch({ type: RESET_CONDITION });
									dispatch({ type: RESET_ACTION });
									dispatch({
										type: INPUT_OK,
										txState: TxState.displayInstallMetamask
									});
									history.push('/');
								}}
							>
								Create new
							</BootstrapButton>
						)}

						{/* ################################ How it works Button*/}
						<BootstrapButton
							style={{ border: 'none' }}
							onClick={() => {
								// First refresh state of Create Page to start from the beginning
								history.push('/how-it-works');
							}}
						>
							How it works
						</BootstrapButton>

						{/* ################################ How it Works Button END */}

						{/* ################################ Connect Button*/}
						{active && chainId === SELECTED_CHAIN_ID && (
							<BootstrapButton
								onClick={() => {
									// IF we are already on dashboard, reload the page on click, otherwise change route
									if (
										history.location.pathname ===
										'/dashboard'
									) {
										window.location.reload();
									} else {
										history.push('/dashboard');
									}
								}}
							>
								{account
									? `${account.substring(
											0,
											6
									  )}...${account.substring(37, 41)}`
									: 'Connected'}
							</BootstrapButton>
						)}
						{active && chainId !== SELECTED_CHAIN_ID && (
							<BootstrapButtonDanger
								startIcon={<WarningIcon />}
								onClick={() => {
									// Update TxState
									dispatch({
										type: UPDATE_TX_STATE,
										txState: TxState.displayWrongNetwork
									});
									// Open Modal
									dispatch({
										type: OPEN_MODAL
									});
								}}
							>
								{'Wrong Network'}
							</BootstrapButtonDanger>
						)}
						{!active && (
							<BootstrapButton onClick={logInLogOutMetamask}>
								{'Connect With Metamask'}
							</BootstrapButton>
						)}
						{/* ################################ Connect Button END*/}
					</Hidden>
					<Hidden mdUp>
						<IconButton
							edge="end"
							onClick={handleDrawerToggle}
							// className={clsx(open && classes.hide)}
							color="inherit"
							aria-label="menu"
						>
							<MenuIcon />
						</IconButton>
					</Hidden>
				</Toolbar>
			</AppBar>
			<Drawer
				className={classes.drawer}
				variant="persistent"
				anchor="right"
				open={mobileOpen}
				classes={{
					paper: classes.drawerPaper
				}}
			>
				<div className={classes.drawerHeader}>
					<IconButton onClick={handleDrawerToggle}>
						{theme.direction === 'rtl' ? (
							<ChevronLeftIcon color="primary" />
						) : (
							<ChevronRightIcon color="primary" />
						)}
					</IconButton>
				</div>
				<Divider />
				<List style={{ color: 'white' }}>
					{active && chainId === SELECTED_CHAIN_ID && (
						<ListItem
							button
							onClick={() => {
								history.push('/dashboard');
								handleDrawerToggle();
							}}
						>
							<ListItemIcon>
								<InboxIcon />
							</ListItemIcon>
							<ListItemText
								primary={
									account
										? `${account.substring(
												0,
												6
										  )}...${account.substring(37, 41)}`
										: 'Connected'
								}
							/>
						</ListItem>
					)}
					<ListItem
						button
						onClick={() => {
							// First refresh state of Create Page to start from the beginning
							history.push('/how-it-works');
							handleDrawerToggle();
						}}
					>
						<ListItemIcon>
							<InboxIcon />
						</ListItemIcon>
						<ListItemText primary={'How it works'} />
					</ListItem>
					{active && chainId === SELECTED_CHAIN_ID && (
						<ListItem
							button
							onClick={() => {
								dispatch({ type: RESET_CONDITION });
								dispatch({ type: RESET_ACTION });
								history.push('/');
								handleDrawerToggle();
							}}
						>
							<ListItemIcon>
								<InboxIcon />
							</ListItemIcon>
							<ListItemText primary={'Create New'} />
						</ListItem>
					)}
					{active && chainId !== SELECTED_CHAIN_ID && (
						<ListItem
							button
							onClick={() => {
								// Update TxState
								dispatch({
									type: UPDATE_TX_STATE,
									txState: TxState.displayWrongNetwork
								});
								// Open Modal
								dispatch({
									type: OPEN_MODAL
								});
								handleDrawerToggle();
							}}
						>
							<ListItemIcon>
								<InboxIcon />
							</ListItemIcon>
							<ListItemText primary={'Wrong Network'} />
						</ListItem>
					)}
					{!active && (
						<ListItem
							button
							onClick={() => {
								logInLogOutMetamask();
								handleDrawerToggle();
							}}
						>
							<ListItemIcon>
								<InboxIcon />
							</ListItemIcon>
							<ListItemText primary={'Connect With Metamask'} />
						</ListItem>
					)}
				</List>
				<Divider />
			</Drawer>
		</React.Fragment>
	);
}
