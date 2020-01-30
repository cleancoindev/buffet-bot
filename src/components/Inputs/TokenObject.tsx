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
import {
	UPDATE_CONDITION_INPUTS,
	UPDATE_ACTION_INPUTS,
	INPUT_CSS,
	COLOURS,
	ETH,
	SELECTED_CHAIN_ID
} from '../../constants/constants';
import {
	getTokenByAddress,
	getTokenList,
	isEth,
	convertWeiToHumanReadableForTokenAmount
} from '../../helpers/helpers';
import { useWeb3React } from '@web3-react/core';

import { ethers } from 'ethers';
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

interface TokenObjectProps {
	token: Token;
}

export default function TokenSelect(props: TokenObjectProps) {
	const { token } = props;
	const { account, active, library, chainId } = useWeb3React();

	// In case network Id is not defined yet, use default
	let networkId: ChainIds = SELECTED_CHAIN_ID;
	if (chainId !== undefined) {
		networkId = chainId as ChainIds;
	}

	const classes = useStyles();

	const [balance, setBalance] = React.useState('');

	useEffect(() => {
		fetchTokenBalance(token);
	}, []);

	const fetchTokenBalance = async (tokenObject: Token) => {
		// Get Erc20 contract
		if (active) {
			const signer = library.getSigner();
			const erc20 = new ethers.Contract(
				tokenObject.address[networkId],
				JSON.stringify(ERC20_ABI),
				signer
			);
			const tokenAddress = tokenObject.address[networkId];
			if (isEth(tokenAddress)) {
				try {
					const balance = await library.getBalance(account);
					let humanReadableBalance = convertWeiToHumanReadableForTokenAmount(
						balance,
						token.decimals
					);
					humanReadableBalance = parseFloat(
						humanReadableBalance
					).toFixed(4);
					setBalance(humanReadableBalance);
				} catch (error) {
					setBalance('');
				}
			} else {
				try {
					const balance = await erc20.balanceOf(account as string);
					if (!balance.eq(ethers.constants.Zero)) {
						let humanReadableBalance = convertWeiToHumanReadableForTokenAmount(
							balance,
							token.decimals
						);
						humanReadableBalance = parseFloat(
							humanReadableBalance
						).toFixed(4);

						setBalance(humanReadableBalance);
					} else {
						setBalance('');
					}
				} catch (error) {
					setBalance('');
				}
			}
		}
	};

	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'start',
				alignItems: 'center',
				flexDirection: 'row',
				width: '100%'
			}}
		>
			{isEth(token.address[1]) && (
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
			{!isEth(token.address[1]) && (
				<img
					style={{
						maxHeight: '35px',
						// width: '35px',
						marginRight: '8px'
					}}
					src={`https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${ethers.utils.getAddress(
						token.address[1]
					)}/logo.png`}
					alt={``}
				></img>
			)}
			<p
				style={{ fontSize: '18px' }}
			>{`${token.symbol} (${token.name})`}</p>
			<div
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'flex-end',
					marginRight: 'auto',
					width: '100%'
				}}
			>
				<p style={{ fontSize: '18px', marginLeft: 'auto' }}>
					{balance}
				</p>
			</div>
		</div>
	);
}
