import { InputType } from './interfaces';
import { ethers } from 'ethers';

const BIG_NUM_ZERO = ethers.constants.Zero;
const BIG_NUM_ONE = ethers.constants.One;

export const APPS = {
	triggers: ['Your Wallet', 'Calendar', 'Kyber'],
	actions: ['Your Wallet', 'Kyber', 'Fulcrum']
};

const EMPTY_STRING_ARRAY: Array<string> = [];

// GENERAL NOTES
/*
- use 'address' in params instead of ERC20, as the decoder function most likely does not know what address is

*/

// Smart Contract Addresses
export const GELATO_CORE_ADDRESS = {
	1: '0x0',
	3: '0x563700A8A6740C8a474DF8F289716afDc30ED07a',
	4: '0x501aF774Eb578203CC34E7171273124A93706C06',
	42: '0x0'
};

export const EXECUTOR_ADDRESS = {
	1: '0x0',
	3: '0x203AdbbA2402a36C202F207caA8ce81f1A4c7a72',
	4: '0x203AdbbA2402a36C202F207caA8ce81f1A4c7a72',
	42: '0x0'
};

// Triggers
export const TTYPES = [
	{
		id: 1,
		app: 'Your Wallet',
		title: 'Token balance',
		address: '0xaf4c11A90e98D0C5ecFb403C62Cc8Dfe8DF11030',
		params: [
			{ type: 'address', name: '_account' },
			{ type: 'address', name: '_coin' },
			{ type: 'uint256', name: '_refBalance' },
			{ type: 'bool', name: '_greaterElseSmaller' }
		],
		abi:
			'function fired(address _account, address _coin, uint256 _refBalance, bool _greaterElseSmaller)',
		getTriggerValueAbi:
			'function getTriggerValue(address _account, address _coin, uint256, bool) view returns (uint256)',
		getTriggerValueInput: BIG_NUM_ZERO,
		userInputTypes: [
			InputType.Address,
			InputType.Token,
			InputType.TokenAmount,
			InputType.Bool,
			InputType.StatelessGetValue
		],
		tokenIndex: 1,
		// Which is the independent variable for the bool is greater than defintion
		boolIndex: 2,
		inputLabels: [
			'Address which balance to monitor',
			'Token',
			'Future balance which should activate the trigger',
			'',
			'Current Balance'
		],
		userInputs: EMPTY_STRING_ARRAY
	},

	// Use isGreater as bool
	{
		id: 2,
		app: 'Kyber',
		title: 'Price on Kyber',
		address: '0x61Bd89De0912c5E07d03f2c533D29A8eB78dc925',
		params: [
			{ type: 'address', name: '_src' },
			{ type: 'uint256', name: '_srcAmount' },
			{ type: 'address', name: '_dest' },
			{ type: 'uint256', name: '_refRate' },
			{ type: 'bool', name: '_greaterElseSmaller' }
		],
		userInputTypes: [
			InputType.Token,
			InputType.TokenAmount,
			InputType.Token,
			InputType.TokenAmount,
			InputType.Bool,
			InputType.StatelessGetValue
		],
		abi:
			'function fired(address _src, uint256 _srcAmount, address _dest, uint256 _refRate, bool _greaterElseSmaller)',
		getTriggerValueAbi:
			'function getTriggerValue(address _src, uint256 _srcAmount, address _dest, uint256, bool) view returns (uint256)',
		// Always 0
		tokenIndex: 0,
		boolIndex: 3,
		getTriggerValueInput: BIG_NUM_ZERO,
		inputLabels: [
			'Sell Token',
			'Sell Volume',
			'Buy Token',
			'Price which activates trigger',
			'',
			'Current Price'
		],
		userInputs: EMPTY_STRING_ARRAY
	},

	{
		id: 3,
		app: 'Calendar',
		title: 'Time',
		address: '0x525EB0c1279f1CC690D01a2Fcb78A0D5d156D1Ee',
		params: [{ type: 'uint256', name: '_timestamp' }],
		abi: 'function fired(uint256 _timestamp)',
		getTriggerValueAbi: '',
		getTriggerValueInput: BIG_NUM_ZERO,
		// 99 means nothing
		tokenIndex: 999,
		boolIndex: 999,
		userInputTypes: [InputType.Date],
		inputLabels: ['Pick a Date and Time'],
		userInputs: EMPTY_STRING_ARRAY
	}
];

// Actions
export const ATYPES = [
	{
		id: 1,
		app: 'ERC 20',
		title: 'Send Tokens',
		address: '0x8FdAf109e391C304939CF64C9B9912b320AdfE56',
		/*
		IERC20 _src,
        uint256 _srcAmt,
        address _beneficiary
		*/
		params: [
			{ type: 'address', name: '_user' },
			{ type: 'address', name: '_userProxy' },
			{ type: 'address', name: '_src' },
			{ type: 'uint256', name: '_srcAmt' },
			{ type: 'address', name: '_beneficiary' }
		],
		abi:
			'function action(address _user, address _userProxy, address _src, uint256 _srcAmount, address _beneficiary)',
		userInputTypes: [
			InputType.Token,
			InputType.TokenAmount,
			InputType.Address
		],
		inputLabels: [
			'Token you want to send',
			'Amount',
			'Address that will receive the tokens'
		],
		userInputs: EMPTY_STRING_ARRAY,
		// For Actions, token Index is 0 as the first two parameters are added only before encoding
		tokenIndex: 0
	},

	{
		id: 2,
		app: 'Kyber',
		title: 'Trade Tokens on Kyber',
		address: '0x67f647bDF012A718d5F9bD9C7bEd6e5a2023ccC6',
		/*
		 // Standard Action Params
        address _user,
        address _userProxy,
        // Specific Action Params
        address _src,
        uint256 _srcAmt,
        address _dest,
        uint256 _minConversionRate

		*/

		params: [
			{ type: 'address', name: '_user' },
			{ type: 'address', name: '_userProxy' },
			{ type: 'address', name: '_src' },
			{ type: 'uint256', name: '_srcAmt' },
			{ type: 'address', name: '_dest' }
		],
		abi:
			'function action(address _user, address _userProxy, address _src, uint256 _srcAmount, address _dest)',
		userInputTypes: [
			InputType.Token,
			InputType.TokenAmount,
			InputType.Token
		],
		inputLabels: [
			'Token you want to sell',
			'Sell Amount',
			'Token you want to buy'
		],
		userInputs: EMPTY_STRING_ARRAY,
		tokenIndex: 0
	}

	// {
	// 	id: 3,
	// 	app: 'Fulcrum',
	// 	title: 'Margin Trade Tokens',
	// 	address: '0x5',
	// 	params: ['uint256', 'address', 'address', 'bool'],
	// 	userInputTypes: [InputType.Token],
	// 	inputLabels: [''],
	// 	userInputs: [],
	// 	tokenIndex: 0
	// }
];

// Add network to tokenList
// Rinkeby
// export const TOKEN_LIST = [
// 	{
// 		address: '0x732fBA98dca813C3A630b53a8bFc1d6e87B1db65',
// 		symbol: 'OMG',
// 		name: 'OmiseGo',
// 		decimals: 18
// 	},
// 	{
// 		address: '0x725d648E6ff2B8C44c96eFAEa29b305e5bb1526a',
// 		symbol: 'MANA',
// 		name: 'MANA',
// 		decimals: 18
// 	},
// 	{
// 		address: '0x6FA355a7b6bD2D6bD8b927C489221BFBb6f1D7B2',
// 		symbol: 'KNC',
// 		name: 'Kyber Network',
// 		decimals: 18
// 	}
// ];

// Ropsten
export const TOKEN_LIST = [
	{
		address: '0x4BFBa4a8F28755Cb2061c413459EE562c6B9c51b',
		symbol: 'OMG',
		name: 'OmiseGo',
		decimals: 18
	},
	{
		address: '0x72fd6C7C1397040A66F33C2ecC83A0F71Ee46D5c',
		symbol: 'MANA',
		name: 'MANA',
		decimals: 18
	},
	{
		address: '0x4E470dc7321E84CA96FcAEDD0C8aBCebbAEB68C6',
		symbol: 'KNC',
		name: 'Kyber Network',
		decimals: 18
	}
];

export interface Token {
	address: string;
	symbol: string;
	name: string;
	decimals: number;
}
