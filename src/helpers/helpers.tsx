import { ATYPES, TTYPES, USER_WHITELIST } from '../constants/whitelist';
import {
	Token,
	RelevantInputData,
	TriggerOrAction
} from '../constants/interfaces';
import { KYBER_TOKEN_LIST, TOKEN_LIST } from '../constants/tokens';

import {
	DEFAULT_DATA_ACTION,
	DEFAULT_DATA_TRIGGER,
	ETH
} from '../constants/constants';
import { utils, ethers } from 'ethers';
import {
	Params,
	ActionWhitelistData,
	TriggerWhitelistData,
	InputType,
	ChainIds
} from '../constants/interfaces';

export function stringifyTimestamp(timestamp: string) {
	let date = new Date(parseInt(timestamp) * 1000);
	return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
}

export function findTriggerById(id: string) {
	let returnData = { ...DEFAULT_DATA_TRIGGER };
	const clonedTriggers = deepCloneTriggers();

	clonedTriggers.forEach(type => {
		if (type.id === parseInt(id)) {
			returnData = type;
		}
	});

	return returnData;
}

export function findTriggerByAddress(address: string, networkId: ChainIds) {
	let returnData = { ...DEFAULT_DATA_TRIGGER };

	const clonedTriggers = deepCloneTriggers();

	clonedTriggers.forEach(type => {
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
	weiAmount: ethers.utils.BigNumber,
	token: Token,
	triggerOrAction: TriggerOrAction,
	id: number
): string => {
	// If kyber price trigger
	if (triggerOrAction === TriggerOrAction.Trigger && id === 2) {
		return ethers.utils.formatUnits(weiAmount, 18);
	}
	return ethers.utils.formatUnits(weiAmount, token.decimals);
};

// Returns String
export const convertHumanReadableToWeiForNumbers = (
	humanReadableAmount: string,
	triggerOrAction: TriggerOrAction,
	id: number
): ethers.utils.BigNumber => {
	// If kyber price trigger
	if (triggerOrAction === TriggerOrAction.Trigger && id === 2) {
		return ethers.utils.parseUnits(humanReadableAmount, 18);
	} else {
		throw Error('Number used for something other than Kyber Price');
		// return ethers.utils.parseUnits(humanReadableAmount, token.decimals);
	}
};

export const userIsWhitelisted = (user: string) => {
	const whitelist = [...USER_WHITELIST];
	let result = false;
	whitelist.forEach(whitelistedUser => {
		if (
			ethers.utils.getAddress(whitelistedUser) ===
			ethers.utils.getAddress(user)
		) {
			result = true;
		}
	});
	return result;
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

			tokenListCopy.push({
				address: copyAddress,
				symbol: copySymbol,
				name: copyName,
				decimals: copyDecimals
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
	userInput: Array<string | number | ethers.utils.BigNumber | boolean>,
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

	const actionPayloadWithSelector = iFace.functions.action.encode(
		copyUserInput
	);

	return actionPayloadWithSelector;
}

export function encodeTriggerPayload(
	userInput: Array<string | number | ethers.utils.BigNumber | boolean>,
	abi: string
) {
	const iFace = new utils.Interface([abi]);

	const triggerPayloadWithSelector = iFace.functions.fired.encode(userInput);

	return triggerPayloadWithSelector;
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

export function decodeTriggerPayload(
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

export const deepCloneTriggers = () => {
	const dataCopy: Array<TriggerWhitelistData> = [];
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

		// clone getTriggerValueAbi
		let clonedGetTriggerValueAbi = '';
		clonedGetTriggerValueAbi = data.getTriggerValueAbi;

		// clone boolIndex:
		const clonedBoolIndex = data.boolIndex;

		// clone getTriggerValueAbi
		let clonedGetTriggerValueInput = data.getTriggerValueInput;

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
			getTriggerValueAbi: clonedGetTriggerValueAbi,
			getTriggerValueInput: clonedGetTriggerValueInput,
			boolIndex: clonedBoolIndex
		});
	});
	return dataCopy;
};

export const isEth = (address: string) => {
	let isEther: boolean;
	// @DEV using 1 for ETH as address is same anyways
	ethers.utils.getAddress(ETH.address[1]) === ethers.utils.getAddress(address)
		? (isEther = true)
		: (isEther = false);
	return isEther;
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

		// clone userInputTypes
		const clonedUserInputTypes: Array<InputType> = [];
		data.userInputTypes.forEach(userInputType => {
			const clonedUserInputType = userInputType;
			clonedUserInputTypes.push(clonedUserInputType);
		});

		const clonedRelevantInputData = [...data.relevantInputData];

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
			relevantInputData: clonedRelevantInputData
		});
	});
	return dataCopy;
};
