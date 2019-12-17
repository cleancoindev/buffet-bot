import React, {
	createContext,
	useContext,
	useState,
	useReducer,
	Dispatch,
	useEffect
} from 'react';
// Import Interfaces
import {
	IcedTx,
	ConditionOrAction,
	Action,
	TxState
} from '../constants/interfaces';

// import reducer function
import { icedTxReducer } from './Reducers';
import { DEFAULT_DATA } from '../constants/constants';

export const DEFAULT_ICED_TX = {
	condition: DEFAULT_DATA,
	action: DEFAULT_DATA,
	txState: TxState.preApprove
};

interface InitContextProps {
	state: IcedTx;
	dispatch: Dispatch<Action>;
}

// Create Context
const IcedTxContext = createContext({
	icedTxState: DEFAULT_ICED_TX,
	dispatch: (action: Action) => {}
});

export const useIcedTxContext = () => useContext(IcedTxContext);

const GlobalStateProvider: React.FunctionComponent = ({ children }) => {
	// useReduced instead of useState
	// Second argument passes initial state
	const [icedTxState, dispatch] = useReducer(icedTxReducer, DEFAULT_ICED_TX);

	useEffect(() => {});
	// const [icedTx, setIcedTx] = React.useState<IcedTx>({
	//     condition: DEFAULT_DATA,
	//     action: DEFAULT_DATA
	// })

	return (
		<IcedTxContext.Provider
			value={{
				icedTxState: icedTxState,
				dispatch: dispatch
			}}
		>
			{children}
		</IcedTxContext.Provider>
	);
};

export default GlobalStateProvider;
