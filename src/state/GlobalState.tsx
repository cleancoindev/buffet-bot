import React, {
	createContext,
	useContext,
	useReducer,
	// Dispatch,
	useEffect
} from 'react';
// Import Interfaces
import { IcedTx, Action, TxState } from '../constants/interfaces';

// Import Web3 React
// Exposes following funcs: 1) getLibrary and 2) _useWeb3ReactManager
import { Web3ReactProvider } from '@web3-react/core';
import { AbstractConnectorInterface } from '@web3-react/types';

// Import ethers.js
import { ethers } from 'ethers';

// import reducer function
import { icedTxReducer } from './Reducers';
import {
	DEFAULT_DATA_ACTION,
	DEFAULT_DATA_CONDITION,
	DEFAULT_PAST_TRANSACTIONS
} from '../constants/constants';

export const DEFAULT_ICED_TX = {
	condition: DEFAULT_DATA_CONDITION,
	action: DEFAULT_DATA_ACTION,
	txState: TxState.displayInstallMetamask,
	pastTransactions: DEFAULT_PAST_TRANSACTIONS
};

// interface InitContextProps {
// 	state: IcedTx;
// 	dispatch: Dispatch<Action>;
// }

// Create web3 Provider using ethers and web3react
const getLibrary = (provider?: any, connector?: AbstractConnectorInterface) => {
	const library = new ethers.providers.Web3Provider(provider);
	// @DEV check what this does
	library.pollingInterval = 8000;
	return library;
};

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

	return (
		<Web3ReactProvider getLibrary={getLibrary}>
			<IcedTxContext.Provider
				value={{
					icedTxState: icedTxState,
					dispatch: dispatch
				}}
			>
				{children}
			</IcedTxContext.Provider>
		</Web3ReactProvider>
	);
};

export default GlobalStateProvider;
