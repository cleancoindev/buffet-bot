import React, { Dispatch, useEffect } from 'react';
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
import TokenObject from './TokenObject';
import {
	UPDATE_CONDITION_INPUTS,
	UPDATE_ACTION_INPUTS,
	INPUT_CSS,
	COLOURS,
	ETH,
	DEFAULT_CHAIN_ID
} from '../../constants/constants';
import {
	getTokenByAddress,
	getTokenList,
	isEth,
	convertWeiToHumanReadableForTokenAmount,
	checkIfMobile,
	deepCloneTokenList
} from '../../helpers/helpers';
import { useWeb3React } from '@web3-react/core';

import { ethers, BigNumber } from 'ethers';
import ERC20_ABI from '../../constants/abis/erc20.json';

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
	findTokenBalance?: Function;
}

export default function TokenSelect(props: TokenSelectProps) {
	const {
		defaultTokenAddress,
		label,
		index,
		conditionOrAction,
		disabled,
		relevantInputData,
		findTokenBalance
	} = props;
	const { dispatch, icedTxState } = useIcedTxContext();
	const { account, active, library, chainId } = useWeb3React();

	// In case network Id is not defined yet, use default
	let networkId: ChainIds = DEFAULT_CHAIN_ID;
	if (chainId !== undefined) {
		networkId = chainId as ChainIds;
	}

	interface Balances {
		balance: string;
		address: string;
	}

	const emptyBalancesArray: Array<Balances> = [];
	const [tokenBalances, setTokenBalances] = React.useState(
		emptyBalancesArray
	);

	// If action, dont display ETH
	let tokenList = getTokenList(relevantInputData, networkId);

	// Fetch token balances
	// useEffect(() => {
	// 	async function fetchTokenBalancesInEffect() {
	// 		const clonedList = deepCloneTokenList(tokenList, networkId);
	// 		let copyTokenBalances = [...tokenBalances];
	// 		for (let index = 0; index < clonedList.length; index++) {
	// 			let balance = await fetchTokenBalance(clonedList[index]);
	// 			copyTokenBalances.push({
	// 				balance: balance,
	// 				address: clonedList[index].address[networkId]
	// 			});
	// 		}
	// 		setTokenBalances(copyTokenBalances);
	// 	}
	// 	if (active) {
	// 		console.log('start fetching');
	// 		fetchTokenBalancesInEffect();
	// 	}
	// }, [active]);

	// const findTokenBalance = (selectedTokenAddress: string) => {
	// 	let returnBalance = '';
	// 	for (let i = 0; i < tokenBalances.length; i++) {
	// 		if (tokenBalances[i].address === selectedTokenAddress) {
	// 			console.log('found');
	// 			console.log(tokenBalances[i].balance);
	// 			returnBalance = tokenBalances[i].balance;
	// 			break;
	// 		}
	// 	}
	// 	return returnBalance;
	// };
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
						<TokenObject
							findTokenBalance={findTokenBalance}
							disabled={disabled}
							token={possibleToken}
							currentToken={token}
						></TokenObject>
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
