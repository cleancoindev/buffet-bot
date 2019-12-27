import { InputType, Params } from './interfaces';
import { colors } from '@material-ui/core';

const emptyUserInputArray: Array<string | number> = [];
const emptyUserInputTypeArray: Array<InputType> = [];

const emptyParamArray: Array<Params> = [];
const emptyStringArray: Array<string> = [];

export const COLOURS = {
	salmon: '#E91E63',
	salmon60: '#E91E6399',
	salmon50: '#E91E6380',
	pink: '#E50078'
};

export const DEFAULT_DATA_ACTION = {
	id: 0,
	app: '',
	title: '',
	address: '',
	params: emptyParamArray, // [ ]
	inputLabels: emptyStringArray, // [ ]
	userInputTypes: emptyUserInputTypeArray, // [ ]
	userInputs: emptyUserInputArray, // [ ]
	approvalIndex: 999 // 999 means no approval in action
};

export const DEFAULT_DATA_CONDITION = {
	id: 0,
	app: '',
	title: '',
	address: '',
	params: emptyParamArray, // [ ]
	inputLabels: emptyStringArray, // [ ]
	userInputTypes: emptyUserInputTypeArray, // [ ]
	userInputs: emptyUserInputArray // [ ]
};

export const DEFAULT_PAST_TRANSACTIONS = [
	{
		id: '0',
		conditionAddress: '0x1',
		actionAddress: '0x5',
		conditionPayload: '0x030949304934009413094309320493049039049204',
		actionPayload: '0x030949304934009413094309320493049039049204',
		expiryDate: '12353434312',
		prepayment: '1009032030020',
		timestamp: '1576759372',
		status: 'open'
	}
	// {
	// 	id: '0',
	// 	conditionAddress: '0x2',
	// 	actionAddress: '0x4',
	// 	conditionPayload: '0x030949304934009413094309320493049039049204',
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

export const INPUT_CSS = {
	root: {
		width: '100%',
		'& input:valid + fieldset': {
			borderColor: COLOURS.salmon,
			borderWidth: 2
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
				borderWidth: 2
			}
		},
		'& .MuiFormLabel-root': {
			color: 'white'
		}
	}
};
