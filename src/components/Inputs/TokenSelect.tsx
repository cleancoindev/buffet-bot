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
import {
	ConditionOrAction,
	Token,
	ChainIds,
	RelevantInputData
} from '../../constants/interfaces';
import {
	UPDATE_CONDITION_INPUTS,
	UPDATE_ACTION_INPUTS,
	INPUT_CSS,
	COLOURS,
	ETH,
	SELECTED_CHAIN_ID
} from '../../constants/constants';
import { getTokenByAddress, getTokenList, isEth } from '../../helpers/helpers';
import { useWeb3React } from '@web3-react/core';

import { ethers } from 'ethers';
import { Divider } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			display: 'block',
			fontSize: '18px'
		},
		formControl: {
			fontSize: '18px',
			// marginRight: '24px',
			width: '100%',

			'& .MuiOutlinedInput-root:hover': {
				'& fieldset': {
					borderColor: 'white'
				}
			},
			'& .MuiOutlinedInput-root.Mui-disabled': {
				'& fieldset': {
					borderColor: '#72627b',
					borderWidth: 1
				}
			},
			'& .MuiOutlinedInput-root.Mui-disabled:hover': {
				'& fieldset': {
					borderColor: '#72627b'
				}
			}
		},
		select: {
			fontSize: '18px',
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
		// listItem: {
		// 	'li:after': {
		// 		content: ' ',
		// 		display: 'block',
		// 		height: '1px',
		// 		borderBottom: 'solid 1px red',
		// 		width: '80%'
		// 	}
		// }
	})
);

interface TokenSelectProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
	label: string;
	index: number;
	conditionOrAction: ConditionOrAction;
	// @DEV CHANGE later when implented better DEFAULT VALUE system, this should only be string
	defaultTokenAddress: string;
	disabled: boolean;
	relevantInputData: RelevantInputData;
}

export default function TokenSelect(props: TokenSelectProps) {
	const {
		defaultTokenAddress,
		label,
		index,
		conditionOrAction,
		disabled,
		relevantInputData
	} = props;
	const { dispatch, icedTxState } = useIcedTxContext();
	const { chainId } = useWeb3React();

	// In case network Id is not defined yet, use default
	let networkId: ChainIds = SELECTED_CHAIN_ID;
	if (chainId !== undefined) {
		networkId = chainId as ChainIds;
	}

	// If action, dont display ETH
	let tokenList = getTokenList(relevantInputData, networkId);

	if (conditionOrAction === ConditionOrAction.Condition) {
		tokenList.splice(0, 0, ETH);
	}

	// Pref
	const [token, setToken] = React.useState<Token>(
		getTokenByAddress(defaultTokenAddress, networkId, relevantInputData)
	);

	// updateUser Input
	const updateConditionInputs = (index: number, value: any) => {
		// Default Index => @DEV Restructure Dispatcher later
		dispatch({ type: UPDATE_CONDITION_INPUTS, index, value });
	};

	const updateActionInputs = (index: number, value: any) => {
		// Default Index => @DEV Restructure Dispatcher later
		dispatch({ type: UPDATE_ACTION_INPUTS, index, value });
	};

	// Based on whether the input is a condition or action, select a different dispatch function
	let updateUserInput: Function;
	updateUserInput =
		conditionOrAction === ConditionOrAction.Condition
			? updateConditionInputs
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
		const tokenObject = getTokenByAddress(
			tokenAddress,
			networkId,
			relevantInputData
		);
		if (tokenObject === undefined) {
			// console.log('ERROR in fetching Token');
			return 'ERROR in finding Token';
		}
		// Update local state
		setToken(tokenObject);
		// Update global state
		updateUserInput(index, tokenObject.address[networkId]);
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
				style={{ color: 'white', fontSize: '18px' }}
				ref={inputLabel}
				id="demo-simple-select-outlined-label"
			>
				{label}
			</InputLabel>
			<Select
				className={classes.select}
				style={{
					textAlign: 'left'
				}}
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
						key={`${key}-${index}-${disabled}-${conditionOrAction}`}
						value={possibleToken.address[networkId]}
						// style={{
						// 	background: 'black',
						// 	color: 'white'
						// }}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'start',
								alignItems: 'center',
								flexDirection: 'row'
							}}
						>
							{isEth(possibleToken.address[1]) && (
								<img
									style={{
										maxHeight: '35px',
										// width: '35px',
										marginRight: '8px'
									}}
									src={
										'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png'
									}
									alt=""
								></img>
							)}
							{!isEth(possibleToken.address[1]) && (
								<img
									style={{
										maxHeight: '35px',
										// width: '35px',
										marginRight: '8px'
									}}
									src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${ethers.utils.getAddress(
										possibleToken.address[1]
									)}/logo.png`}
									alt={``}
								></img>
							)}
							<p
								style={{ fontSize: '18px' }}
							>{`${possibleToken.symbol} (${possibleToken.name}) `}</p>
						</div>
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
