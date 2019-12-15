// Import Interfaces
import {
	ConditionOrAction,
	WhitelistData,
	IcedTx,
	Action
} from '../constants/interfaces';
import { findCondition, findAction } from '../helpers/helpers';
import { DEFAULT_DATA } from '../constants/constants';
import { DEFAULT_ICED_TX } from './GlobalState';

// ACTIONS
export const UPDATE_ACTION_OR_CONDITION = 'UPDATE_ACTION_OR_CONDITION';
export const ADD_USER_INPUT = 'ADD_USER_INPUT';
export const RESET_ACTION_CONDITION_TO_DEFAULT =
	'RESET_ACTION_CONDITION_TO_DEFAULT';

function updateIcedTxCondition(
	state: IcedTx,
	conditionOrAction: ConditionOrAction,
	id: string
) {
	let varName = '';
	let updatedData: WhitelistData = DEFAULT_DATA;
	if (conditionOrAction === ConditionOrAction.Condition) {
		updatedData = findCondition(id);
		varName = 'condition';
	} else if (conditionOrAction === ConditionOrAction.Action) {
		updatedData = findAction(id);
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
	const stateCopy = state;
	if (conditionOrAction === ConditionOrAction.Condition) {
		stateCopy.condition.userInputs[index] = value;
	} else {
		stateCopy.action.userInputs[index] = value;
	}
	return stateCopy;
}

function resetIcedTx() {
	// console.log("reset")
	return DEFAULT_ICED_TX;
}

// Reducer function
export const icedTxReducer = (state: IcedTx, action: Action) => {
	switch (action.type) {
		case UPDATE_ACTION_OR_CONDITION:
			return updateIcedTxCondition(
				state,
				action.conditionOrAction,
				action.id
			);
		case ADD_USER_INPUT:
			return updateUserInput(
				state,
				action.index,
				action.value,
				action.conditionOrAction
			);
		case RESET_ACTION_CONDITION_TO_DEFAULT:
			return resetIcedTx();
		default:
			return state;
	}
};
