import { InputType } from './interfaces';

export const APPS = {
	conditions: ['Your Wallet', 'Calendar', 'Kyber'],
	actions: ['Your Wallet', 'Kyber', 'Fulcrum']
};

// Solidity func for kyber price
// function getExpectedRate(ERC20 src, ERC20 dest, uint srcQty)

// function triggered(ERC20 _sellToken, ERC20 _buyToken, _uint256 srcQuantity, uint256 _selectedRate, bool _mustBeLower)

// Conditions
export const CTYPES = [
	{
		id: 1,
		app: 'Your Wallet',
		title: 'Increase in token balance',
		address: '0x0',
		params: ['ERC20', 'uint256'],
		userInputTypes: [InputType.Token, InputType.GetValue],
		inputLabels: ['Select Token', 'Your current Balance'],
		userInputs: []
	},

	// Use isGreater as bool
	{
		id: 3,
		app: 'Kyber',
		title: 'Price',
		address: '0x1',
		params: ['ERC20', 'ERC20', 'uint256', 'uint256', 'bool'],
		userInputTypes: [
			InputType.Token,
			InputType.Token,
			InputType.Number,
			InputType.Number,
			InputType.Bool,
			InputType.StatelessGetValue
		],
		inputLabels: [
			'Sell Token',
			'Buy Token',
			'Sell Volume (default 1) - The higher, the more reliable',
			'Price to trigger trade',
			'True if inputted price is greater, false if lower',
			'Current Price'
		],
		userInputs: []
	},

	{
		id: 4,
		app: 'Calendar',
		title: 'Time',
		address: '0x2',
		params: ['uint256'],
		userInputTypes: [InputType.Date],
		inputLabels: ['Input Date and Time'],
		userInputs: []
	}
];

// Actions
export const ATYPES = [
	{
		id: 1,
		app: 'Your Wallet',
		title: 'Send Token',
		address: '0x3',
		params: ['ERC20', 'uint256', 'address'],
		userInputTypes: [InputType.Token, InputType.Number, InputType.Address],
		inputLabels: ['Token to send', 'Amount', 'Receiving Address'],
		userInputs: [],
		approvalIndex: 0
	},

	{
		id: 2,
		app: 'Kyber',
		title: 'Trade Tokens',
		address: '0x4',
		params: ['uint256', 'address', 'ERC20', 'bool'],
		userInputTypes: [InputType.Token, InputType.Token, InputType.Number],
		inputLabels: ['Sell Token', 'Buy Token', 'Sell Amount'],
		userInputs: [],
		approvalIndex: 0
	},

	{
		id: 3,
		app: 'Fulcrum',
		title: 'Margin Trade Tokens',
		address: '0x5',
		params: ['uint256', 'address', 'ERC20', 'bool'],
		userInputTypes: [InputType.Token],
		inputLabels: [''],
		userInputs: [],
		approvalIndex: 0
	}
];

/*
export const LIST = {
	conditions: {
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
