// Import Interfaces
import {ConditionOrAction, WhitelistData, IcedTx, Action }from '../constants/interfaces'

import { ATYPES, CTYPES, APPS } from '../constants/whitelist'
import { findCondition, findAction } from '../helpers/helpers'
import { DEFAULT_DATA } from '../constants/constants'


// ACTIONS
export const UPDATE_ACTION_OR_CONDITION = 'UPDATE_ACTION_OR_CONDITION'
export const ADD_USER_INPUT = "ADD_USER_INPUT"


function updateIcedTxCondition(state: IcedTx, conditionOrAction: ConditionOrAction, id: string) {
    let varName = ""
    let updatedData: WhitelistData = DEFAULT_DATA
    if (conditionOrAction === ConditionOrAction.Condition)
    {
        updatedData = findCondition(id)
        varName="condition"

    }
    else if (conditionOrAction === ConditionOrAction.Action)
    {
        updatedData = findAction(id)
        varName="action"

    }
    return {... state, [varName]: updatedData}
    // setData({...data, [varName]: updatedData})
}

function updateUserInput(state: IcedTx, index: number, value: any, conditionOrAction: ConditionOrAction) {
    // Update userInputArray
    const stateCopy = state;
    if (conditionOrAction === ConditionOrAction.Condition)
    {
        stateCopy.condition.userInputs[index] = value

    } else {
        stateCopy.action.userInputs[index] = value
    }
    return stateCopy
}



// Reducer function
export const icedTxReducer = (state: IcedTx, action: Action) => {
    switch(action.type) {
        case UPDATE_ACTION_OR_CONDITION:
            return updateIcedTxCondition(state, action.conditionOrAction, action.id)
        case ADD_USER_INPUT:
            return updateUserInput(state, action.index, action.value, action.conditionOrAction)
        default:
            return state
    }

}