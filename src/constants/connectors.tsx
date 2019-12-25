// Web3 react
import { InjectedConnector } from '@web3-react/injected-connector';

// Web3

// Only support Ropsten for now
export const injected = new InjectedConnector({
	supportedChainIds: [1, 3, 4, 5, 42]
});
