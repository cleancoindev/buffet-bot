import React from "react";
// Import Interfaces
import { TxState } from "../constants/interfaces";

// Import Web3 React
// Exposes following funcs: 1) getLibrary and 2) _useWeb3ReactManager
import { Web3ReactProvider } from "@web3-react/core";

// Import ethers.js
import { ethers, BigNumber } from "ethers";

// import reducer function

import { injected, walletConnect } from "../constants/connectors";
import { AbstractConnector } from "@web3-react/abstract-connector";

const getLibrary = (provider?: any) => {
	// const library = new Web3Provider(provider);
	const library = new ethers.providers.Web3Provider(provider);
	// @DEV check what this does
	library.pollingInterval = 15000;
	return library;
};

export const connectorsByName: { [name: string]: AbstractConnector } = {
	Injected: injected,
	WalletConnect: walletConnect
};

const GlobalStateProvider: React.FunctionComponent = ({ children }) => {
	// useReduced instead of useState
	// Second argument passes initial state

	return (
		<Web3ReactProvider getLibrary={getLibrary}>{children}</Web3ReactProvider>
	);
};

export default GlobalStateProvider;
