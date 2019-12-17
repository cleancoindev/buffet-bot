import { InputType } from './interfaces';

const emptyUserInputArray: Array<string | number> = [];
const emptyUserInputTypeArray: Array<InputType> = [];
const emptyStringArray: Array<string> = [];

export const DEFAULT_DATA = {
	id: 0,
	app: '',
	title: '',
	address: '',
	params: emptyStringArray, // [ ]
	inputLabels: emptyStringArray, // [ ]
	userInputTypes: emptyUserInputTypeArray, // [ ]
	userInputs: emptyUserInputArray // [ ]
};

export const TOKEN_LIST = [
	{ address: '0x0', symbol: 'DAI', name: 'DAI', decimals: 18 },
	{ address: '0x1', symbol: 'WETH', name: 'Wrapped ETH', decimals: 18 },
	{ address: '0x2', symbol: 'KNC', name: 'Kyber Network', decimals: 18 }
];

// ACTIONS

export const RESET_CONDITION = 'RESET_CONDITION';
export const RESET_ACTION = 'RESET_ACTION';
export const UPDATE_ACTION_INPUTS = 'UPDATE_ACTION_INPUTS';
export const UPDATE_CONDITION_INPUTS = 'UPDATE_CONDITION_INPUTS';
export const SELECT_CONDITION = 'SELECT_CONDITION';
export const SELECT_ACTION = 'SELECT_ACTION';
export const UPDATE_TX_STATE = 'UPDATE_TX_STATE';
