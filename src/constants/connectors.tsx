// Web3 react
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';

// Web3

// Only support Ropsten for now
export const injected = new InjectedConnector({
	supportedChainIds: [1, 3, 4, 5, 42]
});

const POLLING_INTERVAL = 12000;
const RPC_URLS: { [chainId: number]: string } = {
	1: `https://mainnet.infura.io/v3/${process.env.REACT_APP_INFURA_SECRET}` as string,
	3: `https://ropsten.infura.io/v3/${process.env.REACT_APP_INFURA_SECRET}` as string,
	4: `https://rinkeby.infura.io/v3/${process.env.REACT_APP_INFURA_SECRET}` as string,
	42: `https://kovan.infura.io/v3/${process.env.REACT_APP_INFURA_SECRET}` as string
};
// Wallet connect

export const defaultNetwork = 1;

// const Infura = new NetworkOnlyConnector({
//   providerURL: supportedNetworkURLs[3]
// });

export const walletConnect = new WalletConnectConnector({
	rpc: {
		// 1: RPC_URLS[1],
		42: RPC_URLS[42] /*, 3: RPC_URLS[3], 4: RPC_URLS[4],  */
	},
	bridge: 'https://bridge.walletconnect.org',
	qrcode: true,
	pollingInterval: POLLING_INTERVAL
});
