import { ATYPES, TTYPES, USER_WHITELIST } from '../constants/whitelist';
import {
	Token,
	RelevantInputData,
	ConditionOrAction
} from '../constants/interfaces';
import { KYBER_TOKEN_LIST, TOKEN_LIST } from '../constants/tokens';
import ERC20_ABI from '../constants/abis/erc20.json';

import {
	DEFAULT_DATA_ACTION,
	DEFAULT_DATA_TRIGGER,
	ETH,
	BIG_NUM_ZERO
} from '../constants/constants';
import { utils, ethers, BigNumber } from 'ethers';
import {
	Params,
	ActionWhitelistData,
	ConditionWhitelistData,
	InputType,
	ChainIds
} from '../constants/interfaces';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';

export function stringifyTimestamp(timestamp: string) {
	let date = new Date(parseInt(timestamp) * 1000);
	return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
}

export function findConditionById(id: string) {
	let returnData = { ...DEFAULT_DATA_TRIGGER };
	const clonedConditions = deepCloneConditions();

	clonedConditions.forEach(type => {
		if (type.id === parseInt(id)) {
			returnData = type;
		}
	});

	return returnData;
}

export function findConditionByAddress(address: string, networkId: ChainIds) {
	let returnData = { ...DEFAULT_DATA_TRIGGER };

	const clonedConditions = deepCloneConditions();

	clonedConditions.forEach(type => {
		if (
			ethers.utils.getAddress(type.address[networkId]) ===
			ethers.utils.getAddress(address)
		) {
			returnData = type;
		}
	});
	return returnData;
}

export function findActionById(id: string) {
	let returnData = { ...DEFAULT_DATA_ACTION };
	const clonedActions = deepCloneActions();
	clonedActions.forEach(type => {
		if (type.id === parseInt(id)) {
			returnData = type;
		}
	});
	return returnData;
}

export function findActionByAddress(address: string, networkId: ChainIds) {
	let returnData = { ...DEFAULT_DATA_ACTION };
	const clonedActions = deepCloneActions();
	clonedActions.forEach(type => {
		if (
			ethers.utils.getAddress(type.address[networkId]) ===
			ethers.utils.getAddress(address)
		) {
			returnData = type;
		}
	});
	return returnData;
}
// @DEV Potenital bug in returning error string
export function getTokenSymbol(
	address: string,
	networkId: ChainIds,
	relevantInputData: RelevantInputData
) {
	const tokenList = getTokenList(relevantInputData, networkId);
	const token = tokenList.find(token => token.address[networkId] === address);
	return token === undefined ? 'ERROR Get Token Symbol' : token.symbol;
}

// Returns String
export const convertWeiToHumanReadableForNumbersAndGetValue = (
	weiAmount: BigNumber,
	token: Token,
	conditionOrAction: ConditionOrAction,
	id: number
): string => {
	// If kyber price condition
	if (conditionOrAction === ConditionOrAction.Condition && id === 3) {
		return ethers.utils.formatUnits(weiAmount, 18);
	}
	return ethers.utils.formatUnits(weiAmount, token.decimals);
};

export const convertWeiToHumanReadableForTokenAmount = (
	weiAmount: BigNumber,
	tokenDecimals: number
): string => {
	return ethers.utils.formatUnits(weiAmount, tokenDecimals);
};

// Returns String
export const convertHumanReadableToWeiForNumbers = (
	humanReadableAmount: string,
	conditionOrAction: ConditionOrAction,
	id: number
): BigNumber => {
	// If kyber price condition
	if (conditionOrAction === ConditionOrAction.Condition && id === 3) {
		return ethers.utils.parseUnits(humanReadableAmount, 18);
	} else {
		throw Error('Number used for something other than Kyber Price');
		// return ethers.utils.parseUnits(humanReadableAmount, token.decimals);
	}
};

export const userIsWhitelisted = (user: string) => {
	const whitelist = [...USER_WHITELIST];
	let result = false;
	try {
		whitelist.forEach(whitelistedUser => {
			if (
				ethers.utils.getAddress(whitelistedUser) ===
				ethers.utils.getAddress(user)
			) {
				result = true;
			}
		});
		return result;
	} catch (error) {
		return false;
	}
};

// @DEV Potenital bug in returning error string
export function getTokenByAddress(
	address: string,
	networkId: ChainIds,
	relevantInputData: RelevantInputData
) {
	if (isEth(address)) {
		return ETH;
	}
	const tokenList = getTokenList(relevantInputData, networkId);
	// console.log(tokenList);
	// console.log(relevantInputData);
	const token = tokenList.find(
		token =>
			ethers.utils.getAddress(token.address[networkId]) ===
			ethers.utils.getAddress(address)
	);

	if (token === undefined) {
		throw Error(`Could not find Token with address ${address}`);
	} else {
		return token;
	}
}

export const deepCloneTokenList = (
	tokenList: Array<Token>,
	networkId: ChainIds
) => {
	const tokenListCopy: Array<Token> = [];
	tokenList.forEach(token => {
		if (token.address[networkId] !== '0x0') {
			let copyAddress = { ...token.address };
			let copySymbol = token.symbol;
			let copyName = token.name;
			let copyDecimals = token.decimals;
			let copyMax = token.max;

			tokenListCopy.push({
				address: copyAddress,
				symbol: copySymbol,
				name: copyName,
				decimals: copyDecimals,
				max: copyMax
			});
		}
	});
	return tokenListCopy;
};

export const getTokenList = (
	relevantInputData: RelevantInputData,
	networkId: ChainIds
): Array<Token> => {
	let tokenListCopy: Array<Token> = [...KYBER_TOKEN_LIST];
	TOKEN_LIST.forEach(list => {
		if (list.name === relevantInputData) {
			tokenListCopy = list.data;
		}

		// throw Error(`Could not find tokenList with relevantInputData: ${relevantInputData}`);
	});
	// console.log(tokenListCopy);
	return deepCloneTokenList(tokenListCopy, networkId);
};

export function encodeActionPayload(
	userInput: Array<string | number | BigNumber | boolean>,
	abi: string,
	user: string,
	userProxy: string
) {
	const iFace = new utils.Interface([abi]);
	//@DEV CHANGE UINT inputs into BigNumbers

	// Insert user address into userInput Array at index 0
	// Make copy to not change global userInput variable
	const copyUserInput = [...userInput];
	copyUserInput.splice(0, 0, user);
	copyUserInput.splice(1, 0, userProxy);

	// const actionPayloadWithSelector = iFace.functions.action.encode(
	// 	copyUserInput
	// );

	const actionPayloadWithSelector = iFace.encodeFunctionData(
		'action',
		copyUserInput
	);

	return actionPayloadWithSelector;
}

export function encodeConditionPayload(
	userInput: Array<string | number | BigNumber | boolean>,
	abi: string
) {
	const iFace = new utils.Interface([abi]);

	// const conditionPayloadWithSelector = iFace.functions.reached.encode(
	// 	userInput
	// );

	const conditionPayloadWithSelector = iFace.encodeFunctionData(
		'reached',
		userInput
	);

	return conditionPayloadWithSelector;
}

export function decodeActionPayload(
	payload: string,
	inputParameter: Array<Params>
) {
	const decodedPayload = ethers.utils.defaultAbiCoder.decode(
		paramsToSimpleParams(inputParameter),
		ethers.utils.hexDataSlice(payload, 4)
	);

	// Delete Index 0 and 1 (user address and proxy address), as those will not be displayed
	decodedPayload.splice(0, 1);
	decodedPayload.splice(0, 1);
	return decodedPayload;
}

export function decodeConditionPayload(
	payload: string,
	inputParameter: Array<Params>
) {
	const decodedPayload = ethers.utils.defaultAbiCoder.decode(
		paramsToSimpleParams(inputParameter),
		ethers.utils.hexDataSlice(payload, 4)
	);

	return decodedPayload;
}

export function paramsToSimpleParams(inputParameter: Array<Params>) {
	let simpleParams: Array<string> = [];
	inputParameter.forEach(parameter => {
		simpleParams.push(parameter.type);
	});
	return simpleParams;
}

export const deepCloneConditions = () => {
	const dataCopy: Array<ConditionWhitelistData> = [];
	TTYPES.forEach(data => {
		// clone Id
		const clonedId = data.id;

		// clone app
		const clonedApp = data.app;

		// clone title
		const clonedTitle = data.title;

		// clone address
		const clonedAddress = { ...data.address };

		// clone params
		const clonedParams: Array<Params> = [];
		data.params.map(param => {
			const clonedParam = { ...param };
			clonedParams.push(clonedParam);
		});

		// clone abi
		const clonedAbi = data.abi;

		// clone getConditionValueAbi
		let clonedGetConditionValueAbi = '';
		clonedGetConditionValueAbi = data.getConditionValueAbi;

		// clone boolIndex:
		const clonedBoolIndex = data.boolIndex;

		// clone getConditionValueAbi
		let clonedGetConditionValueInput = data.getConditionValueInput;

		// clone userInputTypes
		const clonedUserInputTypes: Array<InputType> = [];
		data.userInputTypes.forEach(userInputType => {
			const clonedUserInputType = userInputType;
			clonedUserInputTypes.push(clonedUserInputType);
		});

		// empty user Input
		const clonedTokenIndex = data.approveIndex;

		// clone inputLabels
		const clonedInputLabels: Array<string> = [];
		data.inputLabels.forEach(inputLabel => {
			const clonedInputLabel = inputLabel;
			clonedInputLabels.push(clonedInputLabel);
		});

		const clonedRelevantInputData = [...data.relevantInputData];

		// empty user Input
		const emptyUserInput: Array<string> = [];

		// clone Logo
		let clonedLogo = data.logo;

		dataCopy.push({
			id: clonedId,
			app: clonedApp,
			title: clonedTitle,
			address: clonedAddress,
			params: clonedParams,
			abi: clonedAbi,
			approveIndex: clonedTokenIndex,
			userInputTypes: clonedUserInputTypes,
			inputLabels: clonedInputLabels,
			userInputs: emptyUserInput,
			relevantInputData: clonedRelevantInputData,
			getConditionValueAbi: clonedGetConditionValueAbi,
			getConditionValueInput: clonedGetConditionValueInput,
			boolIndex: clonedBoolIndex,
			logo: clonedLogo
		});
	});
	return dataCopy;
};

export const isEth = (address: string) => {
	let isEther: boolean;
	// @DEV using 1 for ETH as address is same anyways
	if (address !== '0x0') {
		ethers.utils.getAddress(ETH.address[1]) ===
		ethers.utils.getAddress(address)
			? (isEther = true)
			: (isEther = false);
		return isEther;
	} else {
		return false;
	}
};

export const deepCloneActions = () => {
	const dataCopy: Array<ActionWhitelistData> = [];
	ATYPES.forEach(data => {
		// clone Id
		const clonedId = data.id;

		// clone app
		const clonedApp = data.app;

		// clone title
		const clonedTitle = data.title;

		// clone address
		const clonedAddress = { ...data.address };

		// clone params
		const clonedParams: Array<Params> = [];
		data.params.map(param => {
			const clonedParam = { ...param };
			clonedParams.push(clonedParam);
		});

		// clone abi
		const clonedAbi = data.abi;

		// clone abi
		const clonedGetActionValueAbi = data.getActionValueAbi;

		// clone userInputTypes
		const clonedUserInputTypes: Array<InputType> = [];
		data.userInputTypes.forEach(userInputType => {
			const clonedUserInputType = userInputType;
			clonedUserInputTypes.push(clonedUserInputType);
		});

		const clonedRelevantInputData = [...data.relevantInputData];

		const clonedGetActionValueInput = data.getActionValueInput;

		// clone inputLabels
		const clonedInputLabels: Array<string> = [];
		data.inputLabels.forEach(inputLabel => {
			const clonedInputLabel = inputLabel;
			clonedInputLabels.push(clonedInputLabel);
		});

		// empty user Input
		const emptyUserInput: Array<string> = [];

		// empty user Input
		const clonedTokenIndex = data.approveIndex;

		// clone Logo
		let clonedLogo = data.logo;

		dataCopy.push({
			id: clonedId,
			app: clonedApp,
			title: clonedTitle,
			address: clonedAddress,
			params: clonedParams,
			abi: clonedAbi,
			userInputTypes: clonedUserInputTypes,
			inputLabels: clonedInputLabels,
			userInputs: emptyUserInput,
			approveIndex: clonedTokenIndex,
			relevantInputData: clonedRelevantInputData,
			logo: clonedLogo,
			getActionValueAbi: clonedGetActionValueAbi,
			getActionValueInput: clonedGetActionValueInput
		});
	});
	return dataCopy;
};

export const getEtherscanPrefix = (chainId: ChainIds): string => {
	switch (chainId) {
		case 1:
			return '';
		case 3:
			return 'ropsten.';

		case 4:
			return 'rinkeby.';

		case 42:
			return 'kovan.';

		default:
			return '';
	}
};

// Fetch token balances
export const fetchTokenBalance = async (
	tokenObject: Token,
	web3: Web3ReactContextInterface<any>
) => {
	// Dont diplay more mobile
	const networkId = web3.chainId as ChainIds;

	if (web3.active) {
		const signer = web3.library.getSigner();
		const erc20 = new ethers.Contract(
			tokenObject.address[networkId],
			JSON.stringify(ERC20_ABI),
			signer
		);
		const tokenAddress = tokenObject.address[networkId];
		const decimalConverter = 100000000;
		if (isEth(tokenAddress)) {
			try {
				const balance = await web3.library.getBalance(web3.account);
				if (balance.eq(ethers.constants.Zero)) return '';
				else {
					let humanReadableBalance = convertWeiToHumanReadableForTokenAmount(
						balance,
						tokenObject.decimals
					);
					humanReadableBalance = (
						Math.floor(
							parseFloat(humanReadableBalance) * decimalConverter
						) / decimalConverter
					).toFixed(8);
					// Math.floor(1.8959332 * 1000) / 1000 .toFixed(2)
					return humanReadableBalance;
				}
			} catch (error) {
				return '';
			}
		} else {
			try {
				const balance = await erc20.balanceOf(web3.account as string);
				if (!balance.eq(ethers.constants.Zero)) {
					let humanReadableBalance = convertWeiToHumanReadableForTokenAmount(
						balance,
						tokenObject.decimals
					);
					humanReadableBalance = (
						Math.floor(
							parseFloat(humanReadableBalance) * decimalConverter
						) / decimalConverter
					).toFixed(8);

					return humanReadableBalance;
				} else {
					return '';
				}
			} catch (error) {
				return '';
			}
		}
	} else {
		return '';
	}
};

export const checkIfMobile = () => {
	let userAgent = navigator.userAgent;
	let msMaxTouchPoints = navigator.msMaxTouchPoints;
	let hasTouchScreen = false;
	if ('maxTouchPoints' in navigator) {
		hasTouchScreen = navigator.maxTouchPoints > 0;
	} else if ('msMaxTouchPoints' in navigator) {
		hasTouchScreen = msMaxTouchPoints > 0;
	} else {
		var mQ = window.matchMedia && matchMedia('(pointer:coarse)');
		if (mQ && mQ.media === '(pointer:coarse)') {
			hasTouchScreen = !!mQ.matches;
		} else if ('orientation' in window) {
			hasTouchScreen = true; // deprecated, but good fallback
		} else {
			// Only as a last resort, fall back to user agent sniffing
			let UA = userAgent;
			hasTouchScreen =
				/\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
				/\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA);
		}
	}
	return hasTouchScreen;
};

export const getValueFromSmartContractCondition = async (
	condition: ConditionWhitelistData,
	active: boolean,
	networkId: ChainIds,
	account: string,
	inputs: Array<string | number | BigNumber | boolean>
) => {
	// Get abi
	let newValue = BIG_NUM_ZERO;

	// WHen on summary page, return global state
	// if (disabled) return newValue;

	if (active && account) {
		// let abi = '';
		// conditionOrAction === ConditionOrAction.Condition
		// 	? (abi = icedTxState.condition.getConditionValueAbi)
		// 	: (abi = icedTxState.action.getActionValueAbi);

		try {
			// Find token object by address
			// const signer = library.getSigner();
			const signer = ethers.getDefaultProvider();

			let conditionAddress = '';
			let abi = '';
			conditionAddress = condition.address[networkId];
			abi = condition.getConditionValueAbi;

			const conditionContract = new ethers.Contract(
				conditionAddress,
				[abi],
				signer
			);

			// get value
			try {
				newValue = await conditionContract.getConditionValue(...inputs);

				// convert Value into human readable form
				return newValue;
			} catch (error) {
				// console.log(error);
				newValue = BIG_NUM_ZERO;
				return newValue;
			}
		} catch (error) {
			// console.log('token not in state yet');
			// console.log(error);
			newValue = BIG_NUM_ZERO;
			// console.log(error);
			// console.log(3);
			return newValue;
		}
	} else {
		// console.log('catch2');
		newValue = BIG_NUM_ZERO;
		// console.log(4);
		return newValue;
	}
};

export const getValueFromSmartContractAction = async (
	action: ActionWhitelistData,
	active: boolean,
	networkId: ChainIds,
	oldValue: BigNumber,
	account: string,
	inputs: Array<string | number | BigNumber | boolean>
) => {
	// Get abi
	let newValue = oldValue;

	// WHen on summary page, return global state
	// if (disabled) return newValue;

	if (active && account) {
		// let abi = '';
		// conditionOrAction === ConditionOrAction.Condition
		// 	? (abi = icedTxState.condition.getConditionValueAbi)
		// 	: (abi = icedTxState.action.getActionValueAbi);

		try {
			// Find token object by address
			// const signer = library.getSigner();
			const signer = ethers.getDefaultProvider();
			let actionAddress = '';
			let abi = '';
			if (action) {
				actionAddress = action.address[networkId];
				abi = action.getActionValueAbi;
			}

			const actionContract = new ethers.Contract(
				actionAddress,
				[abi],
				signer
			);

			try {
				const copyUserInput = [...inputs];
				copyUserInput.splice(0, 0, account);
				// œDEV simply using account here, as proxy doesnt make a difference
				copyUserInput.splice(1, 0, account);
				newValue = await actionContract.getUsersSendTokenBalance(
					...copyUserInput
				);
				// Convert fetched wei amount to human reable amount

				// convert Value into human readable form
				return newValue;
			} catch (error) {
				// console.log(error);
				newValue = BIG_NUM_ZERO;
				// console.log(2);
				return newValue;
			}
		} catch (error) {
			// console.log('token not in state yet');
			// console.log(error);
			newValue = BIG_NUM_ZERO;
			// console.log(error);
			// console.log(3);
			return newValue;
		}
	} else {
		// console.log('catch2');
		newValue = BIG_NUM_ZERO;
		// console.log(4);
		return newValue;
	}
};
