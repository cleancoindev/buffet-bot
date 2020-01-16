import React, { Dispatch } from 'react';
import {
	makeStyles,
	Theme,
	createStyles,
	withStyles
} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { useIcedTxContext } from '../../state/GlobalState';
import { TriggerOrAction, Token, ChainIds } from '../../constants/interfaces';
import {
	UPDATE_CONDITION_INPUTS,
	UPDATE_ACTION_INPUTS,
	INPUT_CSS,
	COLOURS,
	ETH,
	SELECTED_CHAIN_ID
} from '../../constants/constants';
import { KYBER_TOKEN_LIST } from '../../constants/tokens';
import { ethers } from 'ethers';
import { getTokenByAddress } from '../../helpers/helpers';
import { useWeb3React } from '@web3-react/core';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			display: 'block'
		},
		formControl: {
			// marginRight: '24px',
			width: '100%',
			'& .MuiOutlinedInput-root:hover': {
				'& fieldset': {
					borderColor: 'white'
				}
			},
			'& .MuiOutlinedInput-root.Mui-disabled': {
				'& fieldset': {
					borderColor: COLOURS.salmon,
					borderWidth: 1
				}
			}
		},
		select: {
			'& fieldset': {
				borderColor: COLOURS.salmon,
				borderWidth: 1,
				color: 'white',
				'& .MuiOutlinedInput:hover': {
					borderColor: 'white'
				}
			},
			'& .MuiSelect-root': {
				color: 'white'
			},
			'& .MuiOutlinedInput-notchedOutline': {
				'&:hover': {
					borderColor: 'white'
				}
			}
		}
	})
);

interface TokenSelectProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
	label: string;
	index: number;
	triggerOrAction: TriggerOrAction;
	// @DEV CHANGE later when implented better DEFAULT VALUE system, this should only be string
	defaultTokenAddress: string;
	disabled: boolean;
}

export default function TokenSelect(props: TokenSelectProps) {
	const {
		defaultTokenAddress,
		label,
		index,
		triggerOrAction,
		disabled
	} = props;
	const { dispatch, icedTxState } = useIcedTxContext();
	const { chainId } = useWeb3React();

	// In case network Id is not defined yet, use default
	let networkId: ChainIds = SELECTED_CHAIN_ID;
	if (chainId !== undefined) {
		networkId = chainId as ChainIds;
	}

	// @DEV Add a trigger that always two different tokens will be shown by default

	// If action, dont display ETH
	let tokenList = [...KYBER_TOKEN_LIST];
	if (triggerOrAction === TriggerOrAction.Trigger) {
		tokenList.push(ETH);
	}

	// Pref
	console.log(defaultTokenAddress);
	const [token, setToken] = React.useState<Token>(
		getTokenByAddress(defaultTokenAddress, networkId)
	);
	// console.log(token)
	// console.log(icedTxState)
	// console.log(triggerOrAction)

	// updateUser Input
	const updateTriggerInputs = (index: number, value: any) => {
		// Default Index => @DEV Restructure Dispatcher later
		dispatch({ type: UPDATE_CONDITION_INPUTS, index, value });
	};

	const updateActionInputs = (index: number, value: any) => {
		// Default Index => @DEV Restructure Dispatcher later
		dispatch({ type: UPDATE_ACTION_INPUTS, index, value });
	};

	// Based on whether the input is a trigger or action, select a different dispatch function
	let updateUserInput: Function;
	updateUserInput =
		triggerOrAction === TriggerOrAction.Trigger
			? updateTriggerInputs
			: updateActionInputs;

	const classes = useStyles();

	const [open, setOpen] = React.useState(false);

	const inputLabel = React.useRef<HTMLLabelElement>(null);

	const [labelWidth, setLabelWidth] = React.useState(0);
	React.useEffect(() => {
		setLabelWidth(inputLabel.current!.offsetWidth);
		// Set state wih default token
		updateUserInput(index, token.address[networkId]);
	}, []);

	const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
		const tokenAddress = event.target.value as string;
		const tokenObject = getTokenByAddress(tokenAddress, networkId);
		if (tokenObject === undefined) {
			console.log('ERROR in fetching Token');
			return 'ERROR in finding Token';
		}
		// Update local state
		setToken(tokenObject);
		// Update global state
		console.log('change TokenAddress to');
		console.log(tokenAddress);
		updateUserInput(index, tokenObject.address);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	/* <Button className={classes.button} onClick={handleOpen}>
        Open the select
      </Button> */

	return (
		<FormControl variant="outlined" className={classes.formControl}>
			<InputLabel
				style={{ color: 'white' }}
				ref={inputLabel}
				id="demo-simple-select-outlined-label"
			>
				{label}
			</InputLabel>
			<Select
				className={classes.select}
				style={{ textAlign: 'left' }}
				required
				labelId="demo-simple-select-outlined-label"
				id="demo-simple-select-outlined-label"
				open={open}
				onClose={handleClose}
				onOpen={handleOpen}
				value={token.address[networkId]}
				onChange={handleChange}
				labelWidth={labelWidth}
				disabled={disabled}
				// input={<SalmonSelect />}
			>
				{tokenList.map((possibleToken, key) => (
					<MenuItem
						key={`${key}-${index}-${disabled}-${triggerOrAction}`}
						value={possibleToken.address[networkId]}
					>
						{possibleToken.symbol}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
