import React, { useState, useEffect, useRef } from "react";
import { useWeb3React } from "@web3-react/core";

import { injected } from "../constants/connectors";
import { ChainIds } from "../constants/interfaces";
import { GELATO_CORE_ADDRESS } from "../constants/whitelist";

import { ethers, BigNumber } from "ethers";

import GELATO_CORE_ABI from "../constants/abis/gelatoCore.json";
import GELATO_CORE_SAFE_ABI from "../constants/abis/gelatoCoreSafe.json";
import { POSSIBLE_CHAIN_IDS } from "../constants/constants";

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

export function useGelatoCore() {
	const web3 = useWeb3React();
	if (web3.active && POSSIBLE_CHAIN_IDS.includes(web3.chainId as ChainIds)) {
		const signer = web3.library.getSigner();
		const chainId = web3.chainId as ChainIds;
		const gelatoCoreAddress = GELATO_CORE_ADDRESS[chainId];
		return new ethers.Contract(gelatoCoreAddress, GELATO_CORE_SAFE_ABI, signer);
	} else {
		// console.log('Cannot find gelatoCore');
		// throw Error('Cannot find gelatoCore');
	}
}
