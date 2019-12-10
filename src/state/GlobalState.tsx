import React, {createContext, useContext, useState, useReducer, Dispatch} from 'react'
// Import Interfaces
import { IcedTx, ConditionOrAction, Action } from '../constants/interfaces'

// import reducer function
import { icedTxReducer, UPDATE_ACTION_OR_CONDITION } from './Reducers'

const DEFAULT_DATA = {
    id: 0,
    app: "",
    title: "",
    address: "",
    inputs: [""]
}

const DEFAULT_ICED_TX = {
    condition: DEFAULT_DATA,
    action: DEFAULT_DATA
}

interface InitContextProps {
    state: IcedTx;
    dispatch: Dispatch<Action>;
}

// Create Context
const IcedTxContext = createContext({icedTxState: DEFAULT_ICED_TX, updateIcedTx: (id: string, conditionOrAction: ConditionOrAction) => {}})

export const useIcedTxContext = () => useContext(IcedTxContext)



const GlobalStateProvider: React.FunctionComponent = ({children}) => {
    // useReduced instead of useState
    // Second argument passes initial state
    const [icedTxState, dispatch] = useReducer(icedTxReducer, DEFAULT_ICED_TX)
    console.log(icedTxState)

    // const [icedTx, setIcedTx] = React.useState<IcedTx>({
    //     condition: DEFAULT_DATA,
    //     action: DEFAULT_DATA
    // })

    const updateIcedTx = (id: string, conditionOrAction: ConditionOrAction) => {
        // Update Logic
        setTimeout( () => {
            dispatch({ type: UPDATE_ACTION_OR_CONDITION, conditionOrAction, id })
        }, 700 )
    }

    return (
        <IcedTxContext.Provider
            value={
                {
                    icedTxState: icedTxState,
                    updateIcedTx: updateIcedTx
                }
            }
        >
            {children}
        </IcedTxContext.Provider>
      )


}

export default GlobalStateProvider