import { InputType, RelevantInputData } from './interfaces';
import { ethers } from 'ethers';

const BIG_NUM_ZERO = ethers.constants.Zero;

const EMPTY_STRING_ARRAY: Array<string> = [];

// GENERAL NOTES
/*
- use 'address' in params instead of ERC20, as the decoder function most likely does not know what address is

*/

// Smart Contract Addresses
export const GELATO_CORE_ADDRESS = {
	1: '0x4E2Ca0093028C8401C93AaCcCaF59288CA6fb728',
	3: '0x563700A8A6740C8a474DF8F289716afDc30ED07a',
	4: '0x501aF774Eb578203CC34E7171273124A93706C06',
	42: '0x2b4Bd5d0df60aaE4D68B5a4e315be0bdf72cf765'
};

export const EXECUTOR_ADDRESS = {
	1: '0x4B7363b8a7DaB76ff73dFbA00801bdDcE699F3A2',
	3: '0x203AdbbA2402a36C202F207caA8ce81f1A4c7a72',
	4: '0x203AdbbA2402a36C202F207caA8ce81f1A4c7a72',
	42: '0x203AdbbA2402a36C202F207caA8ce81f1A4c7a72'
};

// NOTES

// Input Type Numbers and StatelessGetValue both might use arbitrary decimals as conversions when reading data from Blockchain as BNs and converting them to human readble form, as conditions such as Kyber Price dont return vlaues based on buyToken decimals, but simply always with 18 decimals

// Conditions
export const TTYPES = [
	{
		id: 1,
		app: 'Calendar',
		title: 'Time',
		address: {
			1: '0x10A46c633adfe5a6719f3DBd2c162676779fE70B',
			3: '0x525EB0c1279f1CC690D01a2Fcb78A0D5d156D1Ee',
			4: '',
			42: '0x036810290a0D1d07a3329baaE54FE65E720e4491'
		},
		params: [{ type: 'uint256', name: '_timestamp' }],
		abi: 'function reached(uint256 _timestamp)',
		getConditionValueAbi: '',
		getConditionValueInput: BIG_NUM_ZERO,
		// 99 means nothing
		approveIndex: 999,
		boolIndex: 999,
		userInputTypes: [InputType.Date],
		inputLabels: ['Pick a Date and Time'],
		userInputs: EMPTY_STRING_ARRAY,
		relevantInputData: [RelevantInputData.none],
		logo: '/images/ethereum_logo.png'
	},
	{
		id: 2,
		app: 'Your Wallet',
		title: 'Token balance',
		address: {
			1: '0x60621bf3F7132838b27972084eaa56E87395D44B',
			3: '0xaf4c11A90e98D0C5ecFb403C62Cc8Dfe8DF11030',
			4: '',
			42: '0xA5EA265F49A574BA5CfeEdB7cE5fc9E330DF1441'
		},
		params: [
			{ type: 'address', name: '_account' },
			{ type: 'address', name: '_coin' },
			{ type: 'uint256', name: '_refBalance' },
			{ type: 'bool', name: '_greaterElseSmaller' }
		],
		abi:
			'function reached(address _account, address _coin, uint256 _refBalance, bool _greaterElseSmaller)',
		getConditionValueAbi:
			'function getConditionValue(address _account, address _coin, uint256, bool) view returns (uint256)',
		getConditionValueInput: BIG_NUM_ZERO,
		userInputTypes: [
			InputType.Address,
			InputType.Token,
			InputType.TokenAmount,
			InputType.Bool,
			InputType.StatelessGetValue
		],
		approveIndex: 1,
		// Which is the independent variable for the bool is greater than defintion
		boolIndex: 2,
		inputLabels: [
			'Address whose balance to monitor',
			'Token',
			'Balance activating the action',
			'',
			'Current Balance of selected address'
		],
		relevantInputData: [
			RelevantInputData.none,
			RelevantInputData.kyberTokenListWithEth,
			RelevantInputData.kyberTokenListWithEth,
			RelevantInputData.none,
			RelevantInputData.kyberTokenListWithEth
		],
		userInputs: EMPTY_STRING_ARRAY,
		logo: '/images/ethereum_logo.png'
	},

	// Use isGreater as bool
	{
		id: 3,
		app: 'Kyber',
		title: 'Price on Kyber',
		address: {
			1: '0xD8eBB69Dc566E86eA6e09A15EBe6Fd9c65c4A698',
			3: '0x61Bd89De0912c5E07d03f2c533D29A8eB78dc925',
			4: '',
			42: '0x4c741109e77D579754AcA15753fa34FA02CBb154'
		},
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
			InputType.Number,
			InputType.Bool,
			InputType.StatelessGetValue
		],
		abi:
			'function reached(address _src, uint256 _srcAmount, address _dest, uint256 _refRate, bool _greaterElseSmaller)',
		getConditionValueAbi:
			'function getConditionValue(address _src, uint256 _srcAmount, address _dest, uint256, bool) view returns (uint256)',
		// Always 0
		approveIndex: 0,
		boolIndex: 3,
		getConditionValueInput: BIG_NUM_ZERO,
		inputLabels: [
			'Sell Token',
			'Sell Volume',
			'Buy Token',
			'Price activating the action',
			'',
			'Current Price'
		],
		userInputs: EMPTY_STRING_ARRAY,
		relevantInputData: [
			RelevantInputData.kyberTokenListWithEth,
			RelevantInputData.kyberTokenListWithEth,
			RelevantInputData.kyberTokenListWithEth,
			RelevantInputData.kyberTokenListWithEth,
			RelevantInputData.none,
			RelevantInputData.kyberTokenListWithEth
		],
		logo: '/images/kyber_logo.png'
	}
];

// Actions
export const ATYPES = [
	{
		id: 1,
		app: 'ERC 20',
		title: 'Send Tokens',
		address: {
			1: '0x24b7b219E903d11489227c5Bed0718D90C03eBc2',
			3: '0x8FdAf109e391C304939CF64C9B9912b320AdfE56',
			4: '',
			42: '0x99cB92f9f853918773de899EBCd942f50f9A6ABb'
		},
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
			InputType.Address,
			InputType.StatelessGetValue
			// Get value
		],
		relevantInputData: [
			RelevantInputData.kyberTokenList,
			RelevantInputData.kyberTokenList,
			RelevantInputData.none,
			RelevantInputData.kyberTokenList
			//@DEV Send tokens will only work for Kyber Tokens
		],
		inputLabels: [
			'Token to send',
			'Amount',
			'Address to receive tokens',
			'Current token balance of address'
		],
		userInputs: EMPTY_STRING_ARRAY,
		// For Actions, token Index is 0 as the first two parameters are added only before encoding
		approveIndex: 0,
		logo: '/images/ethereum_logo.png',
		getActionValueAbi:
			'function getUsersSendTokenBalance(address _user, address _userProxy, address _src, uint256, address) view returns (uint256)',
		getActionValueInput: BIG_NUM_ZERO
	},

	{
		id: 2,
		app: 'Kyber',
		title: 'Trade Tokens on Kyber',
		address: {
			1: '0xF829B506c378AaD11dB7Efe8d626cc7d0e015CBA',
			3: '0x67f647bDF012A718d5F9bD9C7bEd6e5a2023ccC6',
			4: '',
			42: '0xE5656d2dAAbF6a94F7B05315735D33193246289a'
		},
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
			InputType.Token,
			InputType.StatelessGetValue
		],
		inputLabels: [
			'Sell Token',
			'Sell Amount',
			'Buy Token',
			'Current Sell Token Balance'
		],
		relevantInputData: [
			RelevantInputData.kyberTokenList,
			RelevantInputData.kyberTokenList,
			RelevantInputData.kyberTokenListWithEth,
			RelevantInputData.kyberTokenList
		],
		userInputs: EMPTY_STRING_ARRAY,
		approveIndex: 0,
		logo: '/images/kyber_logo.png',
		getActionValueAbi:
			'function getUsersSendTokenBalance(address _user, address _userProxy, address _src, uint256, address) view returns (uint256)',
		getActionValueInput: BIG_NUM_ZERO
	},
	{
		id: 3,
		app: 'Fulcrum',
		title: 'Buy Leverage Tokens on Fulcrum',
		address: {
			1: '0x080d3059b30D3B7EDffa1B0B9AE981f0Ce94168E',
			3: '0x0',
			4: '',
			42: '0x1e2E09a49bda3fc44b792D4aa607Fa301698A91f'
		},
		/*
		 // Standard Action Params
        address _user,
        address _userProxy,
        // Specific Action Params
       	address _depositTokenAddress,
        uint256 _depositAmount,
        address _pTokenAddress

		*/

		params: [
			{ type: 'address', name: '_user' },
			{ type: 'address', name: '_userProxy' },
			{ type: 'address', name: '_depositTokenAddress' },
			{ type: 'uint256', name: '_depositAmount' },
			{ type: 'address', name: '_pTokenAddress' }
		],
		abi:
			'function action(address _user, address _userProxy, address _depositTokenAddress, uint256 _depositAmount, address _pTokenAddress)',
		userInputTypes: [
			InputType.Token,
			InputType.TokenAmount,
			InputType.Token,
			InputType.StatelessGetValue
		],
		inputLabels: [
			'Token to sell',
			'Sell Amount',
			'Leverage Token to buy',
			'Your current sell token balance'
		],
		relevantInputData: [
			RelevantInputData.kyberTokenList,
			RelevantInputData.kyberTokenList,
			RelevantInputData.fulcrumTokenList,
			RelevantInputData.kyberTokenList
		],

		userInputs: EMPTY_STRING_ARRAY,
		approveIndex: 0,
		logo: '/images/fulcrum_logo.png',
		getActionValueAbi:
			'function getUsersSendTokenBalance(address _user, address _userProxy, address _depositTokenAddress, uint256, address) view returns (uint256)',
		getActionValueInput: BIG_NUM_ZERO
	},
	{
		id: 4,
		app: 'Fulcrum',
		title: 'Sell Leverage Tokens on Fulcrum',
		address: {
			1: '0x43dFFE6f0C2029e397Fa47DD27587Ef6297660C3',
			3: '0x0',
			4: '',
			42: '0x62CC3fC9Cf620a48a6587Fd0e3c548bAcEFfAd21'
		},
		params: [
			{ type: 'address', name: '_user' },
			{ type: 'address', name: '_userProxy' },
			{ type: 'address', name: '_pTokenAddress' },
			{ type: 'uint256', name: '_burnAmount' },
			{ type: 'address', name: '_burnTokenAddress' }
		],
		abi:
			'function action(address _user, address _userProxy, address _pTokenAddress, uint256 _burnAmount, address _burnTokenAddress)',
		userInputTypes: [
			InputType.Token,
			InputType.TokenAmount,
			InputType.Token,
			InputType.StatelessGetValue
		],
		inputLabels: [
			'Leverage Token to sell',
			'Sell amount of leverage Token',
			'Token to receive back',
			'Your current Leverage Token Balance'
		],
		relevantInputData: [
			RelevantInputData.fulcrumTokenList,
			RelevantInputData.fulcrumTokenList,
			RelevantInputData.kyberTokenList,
			RelevantInputData.fulcrumTokenList
		],

		userInputs: EMPTY_STRING_ARRAY,
		approveIndex: 0,
		logo: '/images/fulcrum_logo.png',
		getActionValueAbi:
			'function getUsersSendTokenBalance(address _user, address _userProxy, address _pTokenAddress, uint256, address) view returns (uint256)',
		getActionValueInput: BIG_NUM_ZERO
	}
];

export const USER_WHITELIST = [''];
