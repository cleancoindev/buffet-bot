// Import Interfaces
import {ConditionOrAction, WhitelistData, IcedTx, Action }from '../constants/interfaces'

import { ATYPES, CTYPES, APPS } from '../constants/whitelist'
import { findCondition } from '../helpers/helpers'
import { DEFAULT_DATA } from '../constants/constants'


// ACTIONS
export const UPDATE_ACTION_OR_CONDITION = 'UPDATE_ACTION_OR_CONDITION'


function updateIcedTxCondition(data: IcedTx, conditionOrAction: ConditionOrAction, id: string) {
    let varName = ""
    let updatedData: WhitelistData = DEFAULT_DATA
    if (conditionOrAction === ConditionOrAction.Condition)
    {
        updatedData = findCondition(id)
        varName="condition"

    }
    else if (conditionOrAction === ConditionOrAction.Action)
    {
        ATYPES.forEach(type => {
            if (type.id === parseInt(id)) {updatedData = type}
        })
        varName="action"

    }
    return {... data, [varName]: updatedData}
    // setData({...data, [varName]: updatedData})
}



// Reducer function
export const icedTxReducer = (state: IcedTx, action: Action) => {
    switch(action.type) {
        case UPDATE_ACTION_OR_CONDITION:
            return updateIcedTxCondition(state, action.conditionOrAction, action.id)
        default:
            return state
    }

}