import { InputType } from './interfaces';

export const APPS = {
	triggers: ['Your Wallet', 'Calendar', 'Kyber'],
	actions: ['Your Wallet', 'Kyber', 'Fulcrum']
};

// GENERAL NOTES
/*
- use 'address' in params instead of ERC20, as the decoder function most likely does not know what address is

*/

// Smart Contract Addresses
export const GELATO_CORE_ADDRESS = {
	1: '0x0',
	3: '0x653F3612e5A649EB93D60a55A0f0A2C8e0cF6A73',
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
export const CTYPES = [
	// {
	// 	id: 1,
	// 	app: 'Your Wallet',
	// 	title: 'Increase in token balance',
	// 	address: '0x0',
	// 	params: [
	// 		{ type: 'address', name: 'seller' },
	// 		{ type: 'uint256', name: 'amount' },
	// 		{ type: 'uint256', name: 'currentBalance' }
	// 	],
	// 	userInputTypes: [InputType.Token, InputType.Number, InputType.GetValue],
	// 	inputLabels: [
	// 		'Select Token',
	// 		'Increase Amount',
	// 		'Your current Balance'
	// 	],
	// 	userInputs: []
	// },

	// // Use isGreater as bool
	// {
	// 	id: 3,
	// 	app: 'Kyber',
	// 	title: 'Price',
	// 	address: '0x1',
	// 	params: ['address', 'address', 'uint256', 'uint256', 'bool'],
	// 	userInputTypes: [
	// 		InputType.Token,
	// 		InputType.Token,
	// 		InputType.Number,
	// 		InputType.Number,
	// 		InputType.Bool,
	// 		InputType.StatelessGetValue
	// 	],
	// 	inputLabels: [
	// 		'Sell Token',
	// 		'Buy Token',
	// 		'Sell Volume (default 1) - The higher, the more reliable',
	// 		'Price to trigger trade',
	// 		'True if inputted price is greater, false if lower',
	// 		'Current Price'
	// 	],
	// 	userInputs: []
	// },

	{
		id: 4,
		app: 'Calendar',
		title: 'Time',
		address: '0x525EB0c1279f1CC690D01a2Fcb78A0D5d156D1Ee',
		params: [{ type: 'uint256', name: '_timestamp' }],
		abi: ['function fired(uint256 _timestamp)'],
		userInputTypes: [InputType.Date],
		inputLabels: ['Pick a Date and Time'],
		userInputs: []
	}
];

// Actions
export const ATYPES = [
	// {
	// 	id: 1,
	// 	app: 'Your Wallet',
	// 	title: 'Send Tokens',
	// 	address: '0x3',
	// 	params: ['address', 'uint256', 'address'],
	// 	userInputTypes: [InputType.Token, InputType.Number, InputType.Address],
	// 	inputLabels: ['Token to send', 'Amount', 'Receiving Address'],
	// 	userInputs: [],
	// 	approvalIndex: 0
	// },

	{
		id: 2,
		app: 'Kyber',
		title: 'Trade Tokens',
		address: '0x05B0C94eA8EEf2A4Ec19E717C30552298851c761',
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
			{ type: 'address', name: '_dest' },
			{ type: 'uint256', name: '_minConversionRate' }
		],
		abi: [
			'function action(address _user, address _userProxy, address _src, uint256 _srcAmount, address _dest, uint256 _minConversionAmount)'
		],

		userInputTypes: [
			InputType.Token,
			InputType.TokenAmount,
			InputType.Token,
			InputType.Number
		],
		inputLabels: [
			'Token you want to sell',
			'Sell Amount',
			'Token you want to buy',
			'Minimum Conversion Rate'
		],
		userInputs: [],
		approvalIndex: 0
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
	// 	approvalIndex: 0
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

/*
export const LIST = {
	triggers: {
		Your Wallet: {
			tokenBalance: {
				title: "Token Balance",
				address: "0x0"
			},
			etherBalance: {
				title: "Ether Balance",
				address: "0x0"
			}
		},
		Calendar: {
			time: {
				title: "Time",
				address: "0x0"
			}
		},
		Kyber: {
			price: {
				title: "Price",
				address: "0x0"
			}
		}
	},
	actions: {
		Your Wallet: {
			sendToken: {
				title: "Send Token to address",
				address: "0x0"
			}
		},
		Kyber: {
			swap: {
				title: "Swap Token",
				address: "0x0"
			}
		},
		Fulcrum: {
			marginTrade: {
				title: "Margin Trade",
				address: "0x0"
			}
		}
	}
};

*/
