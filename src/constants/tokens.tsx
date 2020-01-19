import { RelevantInputData } from './interfaces';
// 'KYBER_TOKEN_LIST', 'NONE', 'FULCRUM_LEVERAGE_TOKEN_LIST']

// export enum TokenList {
//     KyberTokenList = 0
// }

export const KYBER_TOKEN_LIST = [
	{
		address: {
			1: '0x0',
			3: '0x0',
			4: '0x0',
			42: '0xdB7ec4E4784118D9733710e46F7C83fE7889596a'
		},
		symbol: 'OMG',
		name: 'OmiseGo',
		decimals: 18
	},
	{
		address: {
			1: '0x0',
			3: '0x0',
			4: '0x0',
			42: '0xcb78b457c1F79a06091EAe744aA81dc75Ecb1183'
		},
		symbol: 'MANA',
		name: 'MANA',
		decimals: 18
	},
	{
		address: {
			1: '0x0',
			3: '0x0',
			4: '0x0',
			42: '0xad67cB4d63C9da94AcA37fDF2761AaDF780ff4a2'
		},
		symbol: 'KNC',
		name: 'Kyber Network',
		decimals: 18
	},
	{
		address: {
			1: '0x0',
			3: '0x0',
			4: '0x0',
			42: '0xC4375B7De8af5a38a93548eb8453a498222C4fF2'
		},
		symbol: 'DAI',
		name: 'DAI',
		decimals: 18
	}
];

export const FULCRUM_LEVERAGE_TOKEN_LIST = [
	{
		address: {
			1: '0x0',
			3: '0x0',
			4: '0x0',
			42: '0x934b43143e984052961EB46f5bDE633F33bCDB80'
		},
		symbol: 'dLETH2x',
		name: '2x Long ETH',
		decimals: 18
	},
	{
		address: {
			1: '0x0',
			3: '0x0',
			4: '0x0',
			42: '0x0015Cfd9722B43ac277f37887df14a00109fc689'
		},
		symbol: 'dLETH3x',
		name: '3x Long ETH',
		decimals: 18
	},
	{
		address: {
			1: '0x0',
			3: '0x0',
			4: '0x0',
			42: '0x0E5f87BDcD6285F930b6bbcC3E21CA9d985e12fE'
		},
		symbol: 'dLETH4x',
		name: '4x Long ETH',
		decimals: 18
	},
	{
		address: {
			1: '0x0',
			3: '0x0',
			4: '0x0',
			42: '0xD4Fd1467c867808dc7B393dBc863f34783F37d3E'
		},
		symbol: 'dsETH',
		name: 'Short ETH',
		decimals: 18
	},
	{
		address: {
			1: '0x0',
			3: '0x0',
			4: '0x0',
			42: '0x2EBfbCf2d67867a05BCAC0FbCA54019163253988'
		},
		symbol: 'dsETH2x',
		name: '2x Short ETH',
		decimals: 18
	},
	{
		address: {
			1: '0x0',
			3: '0x0',
			4: '0x0',
			42: '0xB56EA362eA9B1D030213A47eAA452dFfd84CB5a2'
		},
		symbol: 'dsETH3x',
		name: '3x Short ETH',
		decimals: 18
	},
	{
		address: {
			1: '0x0',
			3: '0x0',
			4: '0x0',
			42: '0x9486ac55ed81758787fcdda98e6Ce35b01CDBE72'
		},
		symbol: 'dsETH4x',
		name: '4x Short ETH',
		decimals: 18
	}
];

export const TOKEN_LIST = [
	{
		name: RelevantInputData.kyberTokenList,
		data: [...KYBER_TOKEN_LIST]
	},
	{
		name: RelevantInputData.fulcrumTokenList,
		data: [...FULCRUM_LEVERAGE_TOKEN_LIST]
	}
];
