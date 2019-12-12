import React, {createContext, useContext, useState, useReducer, Dispatch, useEffect} from 'react'
// Import Interfaces
import { IcedTx, ConditionOrAction, Action } from '../constants/interfaces'

// import reducer function
import { icedTxReducer, UPDATE_ACTION_OR_CONDITION, ADD_USER_INPUT } from './Reducers'
import { DEFAULT_DATA } from '../constants/constants'



const DEFAULT_ICED_TX = {
    condition: DEFAULT_DATA,
    action: DEFAULT_DATA
}

interface InitContextProps {
    state: IcedTx;
    dispatch: Dispatch<Action>;
}

// Create Context
const IcedTxContext = createContext(
    {
        icedTxState: DEFAULT_ICED_TX,
        updateIcedTx: (conditionOrAction: ConditionOrAction, id: string) => {},
        updateUserInput: (index: number, value: any, conditionOrAction: ConditionOrAction) => {}
    }
)

export const useIcedTxContext = () => useContext(IcedTxContext)



const GlobalStateProvider: React.FunctionComponent = ({children}) => {
    // useReduced instead of useState
    // Second argument passes initial state
    const [icedTxState, dispatch] = useReducer(icedTxReducer, DEFAULT_ICED_TX)

    useEffect(() => {
        console.log(icedTxState)
    })
    // const [icedTx, setIcedTx] = React.useState<IcedTx>({
    //     condition: DEFAULT_DATA,
    //     action: DEFAULT_DATA
    // })

    const updateIcedTx = (conditionOrAction: ConditionOrAction, id: string) => {
        // Update Logic
        // setTimeout( () => {

        // Default Index => @DEV Restructure Dispatcher later
        const index = 0
        const value = 0
        dispatch({ type: UPDATE_ACTION_OR_CONDITION, conditionOrAction, id, index, value })
        // }, 700 )
    }

    const updateUserInput = (index: number, value: any, conditionOrAction: ConditionOrAction) => {
        // Default Index => @DEV Restructure Dispatcher later
        const id = "0"
        dispatch({ type: ADD_USER_INPUT, conditionOrAction, id, index, value })
    }

    return (
        <IcedTxContext.Provider
            value={
                {
                    icedTxState: icedTxState,
                    updateIcedTx: updateIcedTx,
                    updateUserInput: updateUserInput
                }
            }
        >
            {children}
        </IcedTxContext.Provider>
      )


}

export default GlobalStateProvider