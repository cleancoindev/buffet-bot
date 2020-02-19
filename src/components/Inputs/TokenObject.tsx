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
	DEFAULT_CHAIN_ID
} from '../../constants/constants';
import {
	getTokenByAddress,
	getTokenList,
	isEth,
	convertWeiToHumanReadableForTokenAmount,
	checkIfMobile
} from '../../helpers/helpers';
import { useWeb3React } from '@web3-react/core';

import { ethers, BigNumber } from 'ethers';
import ERC20_ABI from '../../constants/abis/erc20.json';

interface TokenObjectProps {
	token: Token;
	disabled: boolean;
	currentToken: Token;
	findTokenBalance?: Function;
}

export default function TokenSelect(props: TokenObjectProps) {
	const { token, disabled, currentToken, findTokenBalance } = props;
	const { account, active, library, chainId } = useWeb3React();

	// In case network Id is not defined yet, use default
	let networkId: ChainIds = DEFAULT_CHAIN_ID;
	if (chainId !== undefined) {
		networkId = chainId as ChainIds;
	}

	const [balance, setBalance] = React.useState('');

	useEffect(() => {
		if (findTokenBalance !== undefined) {
			if (active) {
				const tokenBalance = findTokenBalance(token.address[networkId]);
				setBalance(tokenBalance);
			}
		}
	});

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
			{!disabled && !checkIfMobile() && (
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
			)}
		</div>
	);
}
