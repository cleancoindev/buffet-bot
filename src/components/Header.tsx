import React, { useState, useEffect } from 'react';

// Routing
import { Link, useHistory } from 'react-router-dom';

// Material UI
import {
	createStyles,
	makeStyles,
	useTheme,
	Theme
} from '@material-ui/core/styles';
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
import MailIcon from '@material-ui/icons/Mail';
import Divider from '@material-ui/core/Divider';

// Web3 React
import { useWeb3React } from '@web3-react/core';
import { useEagerConnect, useInactiveListener } from '../hooks/hooks';
import { injected } from '../constants/connectors';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
	appBar: {
		background: 'transparent'
	},
	menuButton: {
		marginRight: 'auto',
		textDecoration: 'none',
		color: 'white'
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
	const { active, activate, deactivate } = useWeb3React();
	const web3React = useWeb3React();

	// Web3 Logic

	// handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
	const triedEager = useEagerConnect();

	// handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
	useInactiveListener(!triedEager);

	const logInLogOutMetamask = async () => {
		if (active) {
			console.log('log metamask out');
			await deactivate();
		} else {
			console.log('log metamask in');
			await activate(injected);
		}
	};

	// Web3 Logic END

	return (
		<React.Fragment>
			<AppBar className={classes.appBar} position="static">
				<Toolbar>
					<Link className={classes.menuButton} to="/">
						<Typography variant="h6">gelato finance</Typography>
					</Link>
					<Hidden xsDown>
						<Button
							onClick={() => history.push('/dashboard')}
							style={{ color: 'white' }}
						>
							Overview
						</Button>
						<Button
							onClick={logInLogOutMetamask}
							style={{ color: 'white' }}
						>
							{active ? 'LogOut' : 'Connect'}
						</Button>
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
						{theme.direction === 'rtl' ? (
							<ChevronLeftIcon color="primary" />
						) : (
							<ChevronRightIcon color="primary" />
						)}
					</IconButton>
				</div>
				<Divider />
				<List style={{ color: 'white' }}>
					{['Connect', 'Overview'].map((text, index) => (
						<ListItem button key={text}>
							<ListItemIcon>
								<InboxIcon />
							</ListItemIcon>
							<ListItemText primary={text} />
						</ListItem>
					))}
				</List>
				<Divider />
			</Drawer>
		</React.Fragment>
	);
}
