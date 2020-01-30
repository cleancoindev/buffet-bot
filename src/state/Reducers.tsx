// Import Interfaces
import {
	ConditionOrAction,
	IcedTx,
	Action,
	ActionWhitelistData,
	ConditionWhitelistData,
	TxState
} from '../constants/interfaces';
import { findConditionById, findActionById } from '../helpers/helpers';
import {
	RESET_CONDITION,
	SELECT_CONDITION,
	SELECT_ACTION,
	UPDATE_ACTION_INPUTS,
	UPDATE_CONDITION_INPUTS,
	RESET_ACTION,
	UPDATE_TX_STATE,
	DEFAULT_DATA_TRIGGER,
	DEFAULT_DATA_ACTION,
	UPDATE_PAST_TRANSACTIONS,
	OPEN_MODAL,
	CLOSE_MODAL,
	CANCEL_EXECUTION_CLAIM,
	INPUT_ERROR,
	INPUT_OK,
	UPDATE_GET_VALUE_INPUT
} from '../constants/constants';
import { ethers } from 'ethers';

function updateIcedTx(
	state: IcedTx,
	conditionOrAction: ConditionOrAction,
	id: string
) {
	let varName = '';
	let updatedData: ActionWhitelistData | ConditionWhitelistData;
	if (conditionOrAction === ConditionOrAction.Condition) {
		updatedData = findConditionById(id);
		varName = 'condition';
	} else {
		updatedData = findActionById(id);
		varName = 'action';
	}
	return { ...state, [varName]: updatedData };
	// setData({...data, [varName]: updatedData})
}

function updateUserInput(
	state: IcedTx,
	index: number,
	value: any,
	conditionOrAction: ConditionOrAction
) {
	// Update userInputArray
	const stateCopy = { ...state };
	if (conditionOrAction === ConditionOrAction.Condition) {
		stateCopy.condition.userInputs[index] = value;
	} else {
		stateCopy.action.userInputs[index] = value;
	}
	return stateCopy;
}

function setConditionGetValue(
	state: IcedTx,
	newValue: ethers.utils.BigNumber,
	conditionOrAction: ConditionOrAction
) {
	const stateCopy = { ...state };

	if (conditionOrAction === ConditionOrAction.Condition) {
		stateCopy.condition.getConditionValueInput = newValue;
	} else if (conditionOrAction === ConditionOrAction.Action) {
		stateCopy.action.getActionValueInput = newValue;
	}

	return stateCopy;
}

function resetIcedTx(state: IcedTx, conditionOrAction: ConditionOrAction) {
	const stateCopy = { ...state };
	if (conditionOrAction === ConditionOrAction.Condition) {
		stateCopy.condition = { ...DEFAULT_DATA_TRIGGER };
	} else if (conditionOrAction === ConditionOrAction.Action) {
		stateCopy.action = { ...DEFAULT_DATA_ACTION };
	}
	// console.log("reset")
	return stateCopy;
}

/*

export const RESET_CONDITION = 'RESET_CONDITION';
export const RESET_ACTION = 'RESET_ACTION';
export const UPDATE_ACTION_INPUTS = 'UPDATE_ACTION_INPUTS';
export const UPDATE_CONDITION_INPUTS = 'UPDATE_CONDITION_INPUTS';
export const SELECT_CONDITION = 'SELECT_CONDITION';
export const SELECT_ACTION = 'SELECT_ACTION';
*/

// Reducer function
export const icedTxReducer = (state: IcedTx, action: Action) => {
	switch (action.type) {
		case SELECT_CONDITION:
			return updateIcedTx(state, ConditionOrAction.Condition, action.id);
		case SELECT_ACTION:
			return updateIcedTx(state, ConditionOrAction.Action, action.id);
		case UPDATE_CONDITION_INPUTS:
			return updateUserInput(
				state,
				action.index,
				action.value,
				ConditionOrAction.Condition
			);
		case UPDATE_ACTION_INPUTS:
			return updateUserInput(
				state,
				action.index,
				action.value,
				ConditionOrAction.Action
			);
		case RESET_CONDITION:
			return resetIcedTx(state, ConditionOrAction.Condition);
		case RESET_ACTION:
			return resetIcedTx(state, ConditionOrAction.Action);
		case UPDATE_TX_STATE:
			return { ...state, txState: action.txState };
		case UPDATE_PAST_TRANSACTIONS:
			return { ...state, pastTransactions: action.pastTransactions };
		case OPEN_MODAL:
			return { ...state, modalOpen: true };
		case CLOSE_MODAL:
			return { ...state, modalOpen: false };
		case CANCEL_EXECUTION_CLAIM:
			return {
				...state,
				pastTransactionId: action.pastTransactionId,
				modalOpen: true,
				txState: TxState.displayCancel
			};
		case INPUT_ERROR:
			return {
				...state,
				error: {
					isError: true,
					msg: action.msg,
					origin: action.origin
				},
				txState: action.txState
			};
		case INPUT_OK:
			return {
				...state,
				error: { isError: false, msg: '', origin: 999 },
				txState: action.txState
			};
		case UPDATE_GET_VALUE_INPUT:
			return setConditionGetValue(
				state,
				action.newGetValueInput,
				action.conditionOrAction
			);
	}
};
