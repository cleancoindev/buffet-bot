import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';

import { injected } from '../constants/connectors';
import { ChainIds } from '../constants/interfaces';
import { GELATO_CORE_ADDRESS, TOKEN_LIST } from '../constants/whitelist';
import { ethers } from 'ethers';

import GELATO_CORE_ABI from '../constants/abis/gelatoCore.json';
import ERC20_ABI from '../constants/abis/erc20.json';

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
	const { active, error, activate } = useWeb3React();

	useEffect((): any => {
		const { ethereum } = window as any;
		if (ethereum && ethereum.on && !active && !error && !suppress) {
			const handleConnect = () => {
				console.log("Handling 'connect' event");
				activate(injected);
			};
			const handleChainChanged = (chainId: string | number) => {
				console.log(
					"Handling 'chainChanged' event with payload",
					chainId
				);
				activate(injected);
			};
			const handleAccountsChanged = (accounts: string[]) => {
				console.log(
					"Handling 'accountsChanged' event with payload",
					accounts
				);
				if (accounts.length > 0) {
					activate(injected);
				}
			};
			const handleNetworkChanged = (networkId: string | number) => {
				// @DEV REFRESH CONTRACTS IN STATE
				console.log(
					"Handling 'networkChanged' event with payload",
					networkId
				);
				activate(injected);
			};

			ethereum.on('connect', handleConnect);
			ethereum.on('chainChanged', handleChainChanged);
			ethereum.on('accountsChanged', handleAccountsChanged);
			ethereum.on('networkChanged', handleNetworkChanged);

			return () => {
				if (ethereum.removeListener) {
					ethereum.removeListener('connect', handleConnect);
					ethereum.removeListener('chainChanged', handleChainChanged);
					ethereum.removeListener(
						'accountsChanged',
						handleAccountsChanged
					);
					ethereum.removeListener(
						'networkChanged',
						handleNetworkChanged
					);
				}
			};
		}
	}, [active, error, suppress, activate]);
}

export function useGelatoCore() {
	const web3 = useWeb3React();
	if (web3.active) {
		const signer = web3.library.getSigner();
		const chainId = web3.chainId as ChainIds;
		const gelatoCoreAddress = GELATO_CORE_ADDRESS[chainId];
		return new ethers.Contract(gelatoCoreAddress, GELATO_CORE_ABI, signer);
	} else {
		return 'ERROR, NOT active';
	}
}

export function useERC20(index: number) {
	const web3 = useWeb3React();
	if (web3.active) {
		const signer = web3.library.getSigner();
		const erc20Address = TOKEN_LIST[index].address;
		return new ethers.Contract(erc20Address, ERC20_ABI, signer);
	} else {
		return 'ERROR, not active';
	}
}
