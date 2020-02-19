import React, { useState, useEffect, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';

import { injected } from '../constants/connectors';
import { ChainIds } from '../constants/interfaces';
import { GELATO_CORE_ADDRESS } from '../constants/whitelist';

import { ethers, BigNumber } from 'ethers';

import GELATO_CORE_ABI from '../constants/abis/gelatoCore.json';
import GELATO_CORE_SAFE_ABI from '../constants/abis/gelatoCoreSafe.json';
import { POSSIBLE_CHAIN_IDS } from '../constants/constants';

export function useEagerConnect() {
	const { activate, active } = useWeb3React();

	const [tried, setTried] = useState(false);

	useEffect(() => {
		injected.isAuthorized().then((isAuthorized: boolean) => {
			if (isAuthorized) {
				activate(injected, undefined, true).catch(() => {
					setTried(true);
				});
			} else {
				setTried(true);
			}
		});
	}, []); // intentionally only running on mount (make sure it's only mounted once :))

	// if the connection worked, wait until we get confirmation of that to flip the flag
	useEffect(() => {
		if (!tried && active) {
			setTried(true);
		}
	}, [tried, active]);

	return tried;
}

export function useInactiveListener(suppress: boolean = false) {
	// const { active, error, activate } = useWeb3React();
	// const history = useHistory();
	// useEffect((): any => {
	// 	const { ethereum } = window as any;
	// 	if (ethereum && ethereum.on && !active && !error && !suppress) {
	// 		const handleConnect = () => {
	// 			// console.log("Handling 'connect' event");
	// 			// console.log('...');
	// 			// if (history.location.pathname !== '/') activate(injected);
	// 			console.log('1');
	// 		};
	// 		const handleChainChanged = (chainId: string | number) => {
	// 			// console.log(
	// 			// 	"Handling 'chainChanged' event with payload",
	// 			// 	chainId
	// 			// );
	// 			// console.log('...');
	// 			// if (history.location.pathname !== '/') activate(injected);
	// 			console.log('2');
	// 		};
	// 		const handleAccountsChanged = (accounts: string[]) => {
	// 			console.log(
	// 				"Handling 'accountsChanged' event with payload",
	// 				accounts
	// 			);
	// 			console.log('3');
	// 			// if (accounts.length > 0) {
	// 			// 	// NO EAGER CONNECT
	// 			// 	if (history.location.pathname !== '/') activate(injected);
	// 			// }
	// 		};
	// 		const handleNetworkChanged = (networkId: string | number) => {
	// 			// @DEV REFRESH CONTRACTS IN STATE
	// 			console.log(
	// 				"Handling 'networkChanged' event with payload",
	// 				networkId
	// 			);
	// 			console.log('4');
	// 			// if (history.location.pathname === '/dashboard') {
	// 			// 	// Only eager conenct when on dashboard page
	// 			// 	activate(injected);
	// 			// }
	// 		};
	// 		const handleDissconnect = (networkId: string | number) => {
	// 			console.log('5');
	// 			console.log('Disconnect', networkId);
	// 		};
	// 		ethereum.on('connect', handleConnect);
	// 		ethereum.on('chainChanged', handleChainChanged);
	// 		ethereum.on('accountsChanged', handleAccountsChanged);
	// 		ethereum.on('networkChanged', handleNetworkChanged);
	// 		// Subscribe to session disconnection/close
	// 		ethereum.on('disconnect', handleDissconnect);
	// 		return () => {
	// 			if (ethereum.removeListener) {
	// 				ethereum.removeListener('connect', handleConnect);
	// 				ethereum.removeListener('chainChanged', handleChainChanged);
	// 				ethereum.removeListener(
	// 					'accountsChanged',
	// 					handleAccountsChanged
	// 				);
	// 				ethereum.removeListener(
	// 					'networkChanged',
	// 					handleNetworkChanged
	// 				);
	// 				ethereum.removeListener('disconnect', handleDissconnect);
	// 			}
	// 		};
	// 	}
	// }, [active, error, suppress, activate]);
}

export function useGelatoCore() {
	const web3 = useWeb3React();
	if (web3.active && POSSIBLE_CHAIN_IDS.includes(web3.chainId as ChainIds)) {
		const signer = web3.library.getSigner();
		const chainId = web3.chainId as ChainIds;
		const gelatoCoreAddress = GELATO_CORE_ADDRESS[chainId];
		return new ethers.Contract(
			gelatoCoreAddress,
			GELATO_CORE_SAFE_ABI,
			signer
		);
	} else {
		// console.log('Cannot find gelatoCore');
		// throw Error('Cannot find gelatoCore');
	}
}
