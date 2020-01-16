import { InputType, Params } from './interfaces';
import { ethers } from 'ethers';
import { EXECUTOR_ADDRESS } from './whitelist';

export const EMPTY_USER_INPUT_ARRAY: Array<
	string | number | ethers.utils.BigNumber | boolean
> = [];
export const EMPTY_USER_INPUT_TYPE_ARRAY: Array<InputType> = [];

export const EMPTY_PARAM_ARRAY: Array<Params> = [];
export const EMPTY_STRING_ARRAY: Array<string> = [];

export const BIG_NUM_ZERO = ethers.constants.Zero;
export const BIG_NUM_ONE = ethers.constants.One;

export const COLOURS = {
	salmon: '#E91E63',
	salmon60: '#E91E6399',
	salmon50: '#E91E6380',
	pink: '#E50078'
};

export const BOX = {
	border: `1.5px solid ${COLOURS.salmon}`,
	borderRadius: '1px 1px 1px 1px'
};

export const ETH = {
	address: {
		1: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
		3: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
		4: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
		42: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
	},
	symbol: 'ETH',
	name: 'Ether',
	decimals: 18
};

export const SELECTED_CHAIN_ID = 42;
export const SELECTED_NETWORK_NAME = 'Kovan';

export const DEFAULT_DATA_ACTION = {
	id: 0,
	app: '',
	title: '',
	address: { 1: '', 3: '', 4: '', 42: '' },
	params: EMPTY_PARAM_ARRAY, // [ ]
	abi: '',
	inputLabels: EMPTY_STRING_ARRAY, // [ ]
	userInputTypes: EMPTY_USER_INPUT_TYPE_ARRAY, // [ ]
	userInputs: EMPTY_USER_INPUT_ARRAY, // [ ]
	tokenIndex: 999 // 999 means no approval in action
};

export const DEFAULT_DATA_TRIGGER = {
	id: 0,
	app: '',
	title: '',
	address: { 1: '', 3: '', 4: '', 42: '' },
	params: EMPTY_PARAM_ARRAY, // [ ]
	abi: '',
	getTriggerValueAbi: '',
	getTriggerValueInput: BIG_NUM_ZERO,
	tokenIndex: 999,
	inputLabels: EMPTY_STRING_ARRAY, // [ ]
	userInputTypes: EMPTY_USER_INPUT_TYPE_ARRAY, // [ ]
	userInputs: EMPTY_USER_INPUT_ARRAY, // [ ]
	boolIndex: 999
};

// ID that determines which trigger to render by default at initial render of root
export const DEFAULT_TRIGGER_ID = '2';

/*
Interface

	selectedExecutor: string;
	id: string;
	userProxy: string;
	trigger: string;
	triggerPayload: string;
	action: string;
	actionPayload: string;
	triggerGasActionTotalGasMinExecutionGas: number;
	expiryDate: string;
	prepayment: string;
	// Graph specific values
	mintingDate: string;
	executionDate?: string;
	status: string;
}

*/

export const DEFAULT_PAST_TRANSACTIONS = [
	{
		selectedExecutor: EXECUTOR_ADDRESS[3],
		id: '0x1',
		executionClaimId: '1',
		proxyAddress: '0x0',
		trigger: '0x1',
		triggerPayload: '0x030949304934009413094309320493049039049204',
		action: '0x5',
		actionPayload: '0x030949304934009413094309320493049039049204',
		expiryDate: '1',
		prepayment: '1009032030020',
		mintingDate: '1576759372',
		status: 'open',
		triggerGasActionTotalGasMinExecutionGas: [0, 1, 2]
	}
	// {
	// 	id: '0',
	// 	triggerAddress: '0x2',
	// 	actionAddress: '0x4',
	// 	triggerPayload: '0x030949304934009413094309320493049039049204',
	// 	actionPayload: '0x030949304934009413094309320493049039049204',
	// 	expiryDate: '12353434312',
	// 	prepayment: '1009032030020',
	// 	timestamp: '1576759372',
	// 	status: 'executed'
	// }
];

// ACTIONS
export const RESET_CONDITION = 'RESET_CONDITION';
export const RESET_ACTION = 'RESET_ACTION';
export const UPDATE_ACTION_INPUTS = 'UPDATE_ACTION_INPUTS';
export const UPDATE_CONDITION_INPUTS = 'UPDATE_CONDITION_INPUTS';
export const SELECT_CONDITION = 'SELECT_CONDITION';
export const SELECT_ACTION = 'SELECT_ACTION';
export const UPDATE_TX_STATE = 'UPDATE_TX_STATE';
export const UPDATE_PAST_TRANSACTIONS = 'UPDATE_PAST_TRANSACTIONS';
export const OPEN_MODAL = 'OPEN_MODAL';
export const CLOSE_MODAL = 'CLOSE_MODAL';
export const CANCEL_EXECUTION_CLAIM = 'CANCEL_EXECUTION_CLAIM';
export const INPUT_ERROR = 'INPUT_ERROR';
export const INPUT_OK = 'INPUT_OK';
export const UPDATE_GET_VALUE_INPUT = 'UPDATE_GET_VALUE_INPUT';

export const INPUT_CSS = {
	root: {
		width: '100%',
		'& input:valid + fieldset': {
			borderColor: COLOURS.salmon,
			borderWidth: 1
		},
		// '& input:invalid + fieldset': {
		// 	borderColor: 'red',
		// 	borderWidth: 2
		// },
		// '& input:valid:focus + fieldset': {
		// 	borderLeftWidth: 6,
		// 	padding: '4px !important', // override inline-style
		// 	borderColor: 'green'
		// },
		'& .MuiOutlinedInput-root': {
			color: 'white',
			// '& fieldset': {
			// 	borderColor: 'red'
			// },
			'&:hover fieldset': {
				borderColor: 'white'
			}
			// '&.Mui-focused fieldset': {
			// 	borderColor: COLOURS.salmon
			// }
		},
		'& .MuiOutlinedInput-root.Mui-disabled': {
			'& fieldset': {
				borderColor: COLOURS.salmon,
				borderWidth: 1
			}
		},
		'& .MuiFormLabel-root': {
			color: 'white !important'
		}

		// '& .MuiInputBase-input-405': {
		// 	color: 'white'
		// },
		// '& .MuiFormLabel-root-371': {
		// 	color: 'white'
		// }
	}
};
