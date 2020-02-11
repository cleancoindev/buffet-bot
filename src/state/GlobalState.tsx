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

// Import ethers.js
import { ethers, BigNumber } from 'ethers';

// import reducer function
import { icedTxReducer } from './Reducers';
import {
	DEFAULT_DATA_ACTION,
	DEFAULT_DATA_CONDITION,
	DEFAULT_PAST_TRANSACTIONS
} from '../constants/constants';
import { injected, walletConnect } from '../constants/connectors';
import { AbstractConnector } from '@web3-react/abstract-connector';

// @DEV Make Deep Copies
export const DEFAULT_ICED_TX = {
	condition: { ...DEFAULT_DATA_CONDITION },
	action: { ...DEFAULT_DATA_ACTION },
	txState: TxState.displayMobile,
	pastTransactions: { ...DEFAULT_PAST_TRANSACTIONS },
	pastTransactionId: '0',
	modalOpen: false,
	error: { isError: false, msg: '', origin: 999 }
};

// interface InitContextProps {
// 	state: IcedTx;
// 	dispatch: Dispatch<Action>;
// }

// Instruct web3 Provider using ethers and web3react
// new Web3Provider
const getLibrary = (provider?: any) => {
	// const library = new Web3Provider(provider);
	const library = new ethers.providers.Web3Provider(provider);
	// @DEV check what this does
	library.pollingInterval = 15000;
	return library;
};

// Instruct Context
const IcedTxContext = createContext({
	icedTxState: DEFAULT_ICED_TX,
	dispatch: (action: Action) => {}
});

export const useIcedTxContext = () => useContext(IcedTxContext);

// Web3 Connect

export const connectorsByName: { [name: string]: AbstractConnector } = {
	Injected: injected,
	WalletConnect: walletConnect
};

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
