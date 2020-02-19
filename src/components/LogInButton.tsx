import React, { useEffect } from 'react';

// Routing
import { useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { useIcedTxContext } from '../state/GlobalState';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import WarningIcon from '@material-ui/icons/Warning';

import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import { injected, walletConnect } from '../constants/connectors';

import {
	COLOURS,
	DEFAULT_CHAIN_ID,
	UPDATE_TX_STATE,
	OPEN_MODAL,
	RESET_CONDITION,
	RESET_ACTION,
	SELECT_CONDITION,
	DEFAULT_TRIGGER_ID,
	INPUT_OK,
	POSSIBLE_CHAIN_IDS
} from '../constants/constants';
import { TxState, ChainIds } from '../constants/interfaces';
import { getNetworkName } from '../helpers/helpers';

const StyledMenu = withStyles({
	paper: {
		border: '1px solid #d3d4d5'
	}
})((props: MenuProps) => (
	<Menu
		elevation={0}
		getContentAnchorEl={null}
		anchorOrigin={{
			vertical: 'bottom',
			horizontal: 'center'
		}}
		transformOrigin={{
			vertical: 'top',
			horizontal: 'center'
		}}
		{...props}
	/>
));

const StyledMenuItem = withStyles(theme => ({
	root: {
		'&:focus': {
			backgroundColor: theme.palette.primary.main,
			'& .MuiListItemIcon-root, & .MuiListItemText-primary': {
				color: theme.palette.common.white
			}
		}
	}
}))(MenuItem);

const GelatoButton = withStyles({
	root: {
		// minWidth: '150px',
		boxShadow: 'none',
		textTransform: 'none',
		fontSize: 18,
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

// interface LoginButtonProps {
// 	handleProfileMenuOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
// 	handleMobileMenuOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
// }

export default function LoginButton() {
	const {
		account,
		active,
		activate,
		deactivate,
		chainId,
		connector
	} = useWeb3React();
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const history = useHistory();
	const { dispatch } = useIcedTxContext();

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const linkBackToHome = () => {
		dispatch({ type: RESET_CONDITION });
		dispatch({ type: RESET_ACTION });
		dispatch({
			type: INPUT_OK,
			txState: TxState.displayLogIntoMetamask
		});
		history.push('/');
	};

	const displayAccountText = () => {
		if (POSSIBLE_CHAIN_IDS.includes(chainId as ChainIds) && chainId !== 1) {
			return account
				? `${account.substring(0, 6)}... (${getNetworkName(
						chainId as ChainIds
				  )})`
				: 'Rinkeby Testnet';
		} else {
			return account
				? `${account.substring(0, 6)}...${account.substring(38, 42)}`
				: 'Connected';
		}
	};

	return (
		<div>
			<GelatoButton
				aria-controls="customized-menu"
				aria-haspopup="true"
				onClick={handleClick}
				endIcon={<ArrowDropDownIcon />}
			>
				{displayAccountText()}
			</GelatoButton>
			<StyledMenu
				id="customized-menu"
				anchorEl={anchorEl}
				keepMounted
				open={Boolean(anchorEl)}
				onClose={handleClose}
			>
				{/* <StyledMenuItem
					onClick={() => {
						// IF we are already on dashboard, reload the page on click, otherwise change route
						linkBackToHome();
						// if (history.location.pathname === '/dashboard') {
						// 	window.location.reload();
						// } else {
						// 	history.push('/dashboard');
						// }
						handleClose();
					}}
				>
					<span style={{ minWidth: '56px' }}>🤖</span>

					<ListItemText primary="New Instruction" />
				</StyledMenuItem> */}
				<StyledMenuItem
					onClick={() => {
						deactivate();
						if (walletConnect === connector) {
							(connector as any).close();
						}
						linkBackToHome();
						handleClose();
					}}
					style={{ minWidth: '160px' }}
				>
					<span style={{ minWidth: '56px' }}>👋</span>

					{/* <ListItemIcon>
						<DraftsIcon fontSize="small" />
					</ListItemIcon> */}
					<ListItemText primary="Log Out" />
				</StyledMenuItem>
			</StyledMenu>
		</div>
	);
}
