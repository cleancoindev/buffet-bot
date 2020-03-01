import React, { useEffect } from "react";

// Routing
import { useHistory } from "react-router-dom";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";

// Material UI
import {
	makeStyles,
	withStyles,
	useTheme,
	createStyles,
	Theme
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Drawer from "@material-ui/core/Drawer";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import Divider from "@material-ui/core/Divider";
import WarningIcon from "@material-ui/icons/Warning";

// Web3 React
import { useEagerConnect } from "../hooks/hooks";
import {
	COLOURS,
	DEFAULT_CHAIN_ID,
	POSSIBLE_CHAIN_IDS
} from "../constants/constants";
import { connectorsByName } from "../state/GlobalState";
import { TxState, ChainIds } from "../constants/interfaces";
import GelatoLogo from "./Logo/Logo";
import LoginButton from "./LogInButton";
import Web3ConnectButton from "./Web3ConnectButton/Web3ConnectButton";
import { AbstractConnector } from "@web3-react/abstract-connector";

import {
	NoEthereumProviderError,
	UserRejectedRequestError as UserRejectedRequestErrorInjected
} from "@web3-react/injected-connector";

import {
	URI_AVAILABLE,
	UserRejectedRequestError as UserRejectedRequestErrorWalletConnect
} from "@web3-react/walletconnect-connector";

// Google Analytics
// import ReactGA from 'react-ga';

const drawerWidth = 240;

const BootstrapButtonDanger = withStyles({
	root: {
		boxShadow: "none",
		textTransform: "none",
		fontSize: 18,
		padding: "6px 12px",
		border: "1px solid",
		marginLeft: "16px",
		lineHeight: 1.5,
		borderColor: "red",
		backgroundColor: "red",
		color: "black",

		"&:hover": {
			backgroundColor: "red",
			borderColor: "red",
			boxShadow: "none"
		}
		// '&:focus': {
		// 	boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)'
		// }
	}
})(Button);

const BootstrapButton = withStyles({
	root: {
		// minWidth: '150px',
		boxShadow: "none",
		textTransform: "none",
		fontSize: 18,
		padding: "6px 12px",
		// marginLeft: '16px',
		lineHeight: 1.5,
		border: "0.5px solid",
		borderColor: COLOURS.salmon,
		// borderRadius: '1px 1px 1px 1px',
		color: "black",

		"&:hover": {
			backgroundColor: COLOURS.salmon50,
			borderColor: "black",
			boxShadow: "none"
		},
		"&:active": {
			boxShadow: "none",
			backgroundColor: "#0062cc",
			borderColor: "#005cbf"
		}
		// '&:focus': {
		// 	boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)'
		// }
	}
})(Button);

const useStyles = makeStyles(theme => ({
	appBar: {
		background: "transparent",
		paddingTop: "16px",
		boxShadow: "none"
	},
	menuButton: {
		marginRight: "auto",
		textDecoration: "none",
		color: "black",
		cursor: "pointer",
		// '&:hover': { color: COLOURS.salmon },
		display: "flex",
		flexDirection: "row",
		justify: "center",
		alignItems: "center"
	},
	title: {
		flexGrow: 1
	},
	rightSide: {
		marginLeft: "auto"
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth,
		background: "white"
	},
	drawerHeader: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(0, 1),
		...theme.mixins.toolbar,
		justifyContent: "flex-start"
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

	const { account, active, activate, deactivate, chainId } = useWeb3React();

	let networkId = DEFAULT_CHAIN_ID;
	if (chainId !== undefined) {
		networkId = chainId as ChainIds;
	}

	// Catch Web3 React Errors
	function getErrorMessage(error: Error) {
		if (error instanceof NoEthereumProviderError) {
			return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
		} else if (error instanceof UnsupportedChainIdError) {
			return "You're connected to an unsupported network.";
		} else if (
			error instanceof UserRejectedRequestErrorInjected ||
			error instanceof UserRejectedRequestErrorWalletConnect
			//   || error instanceof UserRejectedRequestErrorFrame
		) {
			return "Please authorize this website to access your Ethereum account.";
		} else {
			console.error(error);
			return "An unknown error occurred. Check the console for more details.";
		}
	}

	// handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
	// Only eager connect when in dashboard
	const triedEager = useEagerConnect();

	// handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists

	const logInWeb3 = async (connector: AbstractConnector) => {
		if (!active) {
			// await activate(injected);
			await activate(connector);
		} else {
		}
	};

	const linkBackToHome = () => {
		// Do not Change state when already on ROOT /
		if (history.location.pathname !== "/") {
			history.push("/");
		}
	};

	// Web3 Logic END

	return (
		<React.Fragment>
			<AppBar className={classes.appBar} position="static">
				<Toolbar style={{ paddingLeft: "0px", paddingRight: "0px" }}>
					{/* <Link className={classes.menuButton} to="/"> */}
					<div className={classes.menuButton} onClick={linkBackToHome}>
						<GelatoLogo></GelatoLogo>
					</div>
					{/* </Link> */}
					<Hidden xsDown>
						{active && POSSIBLE_CHAIN_IDS.includes(networkId) && (
							<LoginButton></LoginButton>
						)}
						{active && !POSSIBLE_CHAIN_IDS.includes(networkId) && (
							<BootstrapButtonDanger
								startIcon={<WarningIcon />}
								onClick={() => {
									// Update TxState
								}}
							>
								{"Wrong Network"}
							</BootstrapButtonDanger>
						)}

						{!active && (
							<Web3ConnectButton></Web3ConnectButton>
							// <BootstrapButton
							// 	style={{ marginLeft: '16px' }}
							// 	onClick={logInLogOutMetamask}
							// >
							// 	{'Connect Metamask'}
							// </BootstrapButton>
						)}
						{/* ################################ Connect Button END*/}
					</Hidden>
					<Hidden smUp>
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
						{theme.direction === "rtl" ? (
							<ChevronLeftIcon color="primary" />
						) : (
							<ChevronRightIcon color="primary" />
						)}
					</IconButton>
				</div>
				<Divider />
				<List style={{ color: "black" }}>
					{active && POSSIBLE_CHAIN_IDS.includes(networkId) && (
						<ListItem>
							<ListItemIcon>
								<InboxIcon />
							</ListItemIcon>
							<ListItemText
								style={{ color: COLOURS.salmon }}
								primary={
									account
										? `${account.substring(0, 6)}...${account.substring(
												38,
												42
										  )}`
										: "Connected"
								}
							/>
						</ListItem>
					)}
					{active && !POSSIBLE_CHAIN_IDS.includes(networkId) && (
						<ListItem
							button
							onClick={() => {
								// Update TxState

								handleDrawerToggle();
							}}
						>
							<ListItemIcon>
								<InboxIcon />
							</ListItemIcon>
							<ListItemText primary={"Wrong Network"} />
						</ListItem>
					)}
					{!active && (
						<React.Fragment>
							<ListItem
								button
								onClick={() => {
									logInWeb3(connectorsByName.Injected);
									handleDrawerToggle();
								}}
							>
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary={"Connect With Metamask"} />
							</ListItem>
							<ListItem
								button
								onClick={() => {
									logInWeb3(connectorsByName.WalletConnect);
									handleDrawerToggle();
								}}
							>
								<ListItemIcon>
									<InboxIcon />
								</ListItemIcon>
								<ListItemText primary={"Connect With Wallet Connect"} />
							</ListItem>
						</React.Fragment>
					)}

					{active && POSSIBLE_CHAIN_IDS.includes(networkId) && (
						<ListItem
							button
							onClick={() => {
								deactivate();
								handleDrawerToggle();
							}}
						>
							<ListItemIcon>
								<InboxIcon />
							</ListItemIcon>
							<ListItemText primary={"Log Out"} />
						</ListItem>
					)}
				</List>
				<Divider />
			</Drawer>
		</React.Fragment>
	);
}
