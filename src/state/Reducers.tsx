// Import Interfaces
import {
	TriggerOrAction,
	IcedTx,
	Action,
	ActionWhitelistData,
	TriggerWhitelistData,
	TxState
} from '../constants/interfaces';
import { findTriggerById, findActionById } from '../helpers/helpers';
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

function updateIcedTx(
	state: IcedTx,
	triggerOrAction: TriggerOrAction,
	id: string
) {
	let varName = '';
	let updatedData: ActionWhitelistData | TriggerWhitelistData;
	if (triggerOrAction === TriggerOrAction.Trigger) {
		updatedData = findTriggerById(id);
		varName = 'trigger';
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
	triggerOrAction: TriggerOrAction
) {
	// Update userInputArray
	const stateCopy = { ...state };
	if (triggerOrAction === TriggerOrAction.Trigger) {
		stateCopy.trigger.userInputs[index] = value;
	} else {
		stateCopy.action.userInputs[index] = value;
	}
	return stateCopy;
}

function setTriggerGetValue(state: IcedTx, newValue: string) {
	console.log('setTriggerValue in reducer');
	const stateCopy = { ...state };

	stateCopy.trigger.getTriggerValueInput = newValue;

	return stateCopy;
}

function resetIcedTx(state: IcedTx, triggerOrAction: TriggerOrAction) {
	const stateCopy = { ...state };
	if (triggerOrAction === TriggerOrAction.Trigger) {
		stateCopy.trigger = { ...DEFAULT_DATA_TRIGGER };
	} else if (triggerOrAction === TriggerOrAction.Action) {
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
			return updateIcedTx(state, TriggerOrAction.Trigger, action.id);
		case SELECT_ACTION:
			return updateIcedTx(state, TriggerOrAction.Action, action.id);
		case UPDATE_CONDITION_INPUTS:
			return updateUserInput(
				state,
				action.index,
				action.value,
				TriggerOrAction.Trigger
			);
		case UPDATE_ACTION_INPUTS:
			return updateUserInput(
				state,
				action.index,
				action.value,
				TriggerOrAction.Action
			);
		case RESET_CONDITION:
			return resetIcedTx(state, TriggerOrAction.Trigger);
		case RESET_ACTION:
			return resetIcedTx(state, TriggerOrAction.Action);
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
				error: { isError: true, msg: action.msg },
				txState: TxState.inputError
			};
		case INPUT_OK:
			return {
				...state,
				error: { isError: false, msg: '' }
			};
		case UPDATE_GET_VALUE_INPUT:
			return setTriggerGetValue(state, action.newGetValueInput);
	}
};
