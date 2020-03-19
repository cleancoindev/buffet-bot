import {
	ATYPES,
	TTYPES,
	USER_WHITELIST,
	GELATO_CORE_ADDRESS
} from "../constants/whitelist";
import {
	Token,
	RelevantInputData,
	ConditionOrAction,
	DeprecatedAddresses
} from "../constants/interfaces";

import {
	DEFAULT_DATA_ACTION,
	DEFAULT_DATA_CONDITION,
	ETH
} from "../constants/constants";
import { utils, ethers } from "ethers";
import {
	Params,
	ActionWhitelistData,
	ConditionWhitelistData,
	InputType,
	ChainIds
} from "../constants/interfaces";

export function stringifyTimestamp(timestamp: string) {
	let date = new Date(parseInt(timestamp) * 1000);
	return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
}

export function findConditionById(id: string) {
	let returnData = { ...DEFAULT_DATA_CONDITION };
	const clonedConditions = deepCloneConditions();

	clonedConditions.forEach(type => {
		if (type.id === parseInt(id)) {
			returnData = type;
		}
	});

	return returnData;
}

export function findConditionByAddress(address: string, networkId: ChainIds) {
	let returnData = { ...DEFAULT_DATA_CONDITION };

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

export function findDeprecatedCondition(address: string, networkId: ChainIds) {
	let returnData = { ...DEFAULT_DATA_CONDITION };

	const clonedConditions = deepCloneConditions();

	for (let j = 0; j < clonedConditions.length; j++) {
		const condition = clonedConditions[j];

		const deprecatedAddresses = condition.deprecatedAddresses[networkId];

		// console.log(condition.deprecatedAddresses);
		for (let i = 0; i < deprecatedAddresses.length; i++) {
			try {
				if (
					ethers.utils.getAddress(deprecatedAddresses[i]) ===
					ethers.utils.getAddress(address)
				) {
					returnData = condition;
					break;
				}
			} catch (error) {}
		}
	}

	return returnData;
}

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
		// data.params.map(param => {
		// 	const clonedParam = { param };
		// 	clonedParams.push(clonedParam);
		// });

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

		// Clone deprecated addresses
		const clonedDeprecatedAddresses: DeprecatedAddresses = {
			1: [...data.deprecatedAddresses[1]],
			3: [...data.deprecatedAddresses[3]],
			4: [...data.deprecatedAddresses[4]],
			42: [...data.deprecatedAddresses[42]]
		};

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
			getActionValueInput: clonedGetActionValueInput,
			deprecatedAddresses: clonedDeprecatedAddresses
		});
	});
	return dataCopy;
};

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

// Returns String
export const convertWeiToHumanReadableForNumbersAndGetValue = (
	weiAmount: ethers.utils.BigNumber,
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
	weiAmount: ethers.utils.BigNumber,
	tokenDecimals: number
): string => {
	return ethers.utils.formatUnits(weiAmount, tokenDecimals);
};

// Returns String
export const convertHumanReadableToWeiForNumbers = (
	humanReadableAmount: string,
	conditionOrAction: ConditionOrAction,
	id: number
): ethers.utils.BigNumber => {
	// If kyber price condition
	if (conditionOrAction === ConditionOrAction.Condition && id === 3) {
		return ethers.utils.parseUnits(humanReadableAmount, 18);
	} else {
		throw Error("Number used for something other than Kyber Price");
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

export const deepCloneTokenList = (
	tokenList: Array<Token>,
	networkId: ChainIds
) => {
	const tokenListCopy: Array<Token> = [];
	tokenList.forEach(token => {
		if (token.address[networkId] !== "0x0") {
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

export function encodeActionPayload(
	userInput: Array<string | number | ethers.utils.BigNumber | boolean>,
	abi: string,
	userProxy: string,
	user: string
) {
	const iFace = new utils.Interface([abi]);
	//@DEV CHANGE UINT inputs into BigNumbers

	// Insert user address into userInput Array at index 0
	// Make copy to not change global userInput variable
	// const copyUserInput = [...userInput];
	// copyUserInput.splice(0, 0, user);
	// copyUserInput.splice(1, 0, userProxy);

	// const actionPayloadWithSelector = iFace.functions.action.encode(
	// 	copyUserInput
	// );

	const actionPayloadWithSelector = "test"

	// const actionPayloadWithSelector = iFace.encodeFunctionData(
	// 	"action",
	// 	userInput
	// );

	return actionPayloadWithSelector;
}

export function encodeActionPayloadTwo(
	userInput: Array<string | number | ethers.utils.BigNumber | boolean>,
	abi: string
) {
	const iFace = new utils.Interface([abi]);
	//@DEV CHANGE UINT inputs into BigNumbers

	// Insert user address into userInput Array at index 0
	// Make copy to not change global userInput variable
	// const copyUserInput = [...userInput];
	// copyUserInput.splice(0, 0, user);
	// copyUserInput.splice(1, 0, userProxy);

	// const actionPayloadWithSelector = iFace.functions.action.encode(
	// 	copyUserInput
	// );

	// const actionPayloadWithSelector = iFace.encodeFunctionData(
	// 	"action",
	// 	userInput
	// );
	const actionPayloadWithSelector = "test"

	return actionPayloadWithSelector;
}

export function encodeConditionPayload(
	userInput: Array<string | number | ethers.utils.BigNumber | boolean>,
	abi: string
) {
	const iFace = new utils.Interface([abi]);

	// const conditionPayloadWithSelector = iFace.functions.reached.encode(
	// 	userInput
	// );

	// const conditionPayloadWithSelector = iFace.encodeFunctionData(
	// 	"reached",
	// 	userInput
	// );

	const conditionPayloadWithSelector = "test"

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
		let clonedGetConditionValueAbi = "";
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

		const clonedDeprecatedAddresses: DeprecatedAddresses = {
			1: [...data.deprecatedAddresses[1]],
			3: [...data.deprecatedAddresses[3]],
			4: [...data.deprecatedAddresses[4]],
			42: [...data.deprecatedAddresses[42]]
		};

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
			logo: clonedLogo,
			deprecatedAddresses: clonedDeprecatedAddresses
		});
	});
	return dataCopy;
};

export const isEth = (address: string) => {
	let isEther: boolean;
	// @DEV using 1 for ETH as address is same anyways
	if (address !== "0x0") {
		ethers.utils.getAddress(ETH.address[1]) === ethers.utils.getAddress(address)
			? (isEther = true)
			: (isEther = false);
		return isEther;
	} else {
		return false;
	}
};

export const getWhitelistGelatoOnSafePayload = (
	account: string,
	networkId: ChainIds
) => {
	const gnosisSafeMasterCopy = "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F";

	// Step 2: Calculcate initializer payload

	const setupAbi = [
		"function setup(address[] _owners, uint256 _threshold, address to, bytes data, address fallbackHandler, address paymentToken, uint256 payment, address payable paymentReceiver) external"
	];

	const safeOwners = [account];
	const signatureThreshold = 1;

	// Whitelist GelatoCore as module script
	const addressTo = "0x34A53927cA6927e41b18d8f23B53bBC81cC844f3";

	// const whitelistGelatoCoreScriptAbi = [
	// 	'function whitelist(address _gelatoCore)'
	// ];

	const enableModuleAndMint = [
		"function enableModuleAndMint(address _gelatoCore, address[2] _selectedProviderAndExecutor, address[2] _conditionAndAction, bytes _conditionPayloadWithSelector, bytes _actionPayloadWithSelector)"
	];

	const selectedProviderAndExecutor = [
		"0x7015763d0a8F04263633106DE7a8F33B2334E51e",
		"0x4d671CD743027fB5Af1b2D2a3ccbafA97b5B1B80"
	];

	const conditionAndAction = [
		"0x4131A080145F39424cdeb4645bA673b53570CAB3",
		"0x8FEb96c37AAFE8980176D70Ac39dAf10b4121e8E"
	];

	const condition = findConditionById("4");
	const action = findActionById("10");

	const conditionPayload = encodeConditionPayload([50], condition.abi);
	const actionPayload = encodeActionPayloadTwo([], action.abi);

	const iFaceSetupModule = new ethers.utils.Interface(enableModuleAndMint);
	const setupModulesPayload = "test"

	// = iFaceSetupModule.encodeFunctionData(
	// 	"enableModuleAndMint",
	// 	[
	// 		GELATO_CORE_ADDRESS[networkId],
	// 		selectedProviderAndExecutor,
	// 		conditionAndAction,
	// 		conditionPayload,
	// 		actionPayload
	// 	]
	// );

	const fallbackHandler = ethers.constants.AddressZero;
	const paymentToken = ethers.constants.AddressZero;
	const payment = ethers.constants.Zero;
	const paymentReceiver = ethers.constants.AddressZero;

	const iFaceSetup = new ethers.utils.Interface(setupAbi);
	const setupPayload  = "test"

	// = iFaceSetup.encodeFunctionData("setup", [
	// 	safeOwners,
	// 	signatureThreshold,
	// 	addressTo,
	// 	setupModulesPayload,
	// 	fallbackHandler,
	// 	paymentToken,
	// 	payment,
	// 	paymentReceiver
	// ]);
	return [gnosisSafeMasterCopy, setupPayload];
};

export const getWhitelistGelatoOnSafePayloadOld = (
	account: string,
	networkId: ChainIds
) => {
	const gnosisSafeMasterCopy = "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F";

	// Step 2: Calculcate initializer payload

	const setupAbi = [
		"function setup(address[] _owners, uint256 _threshold, address to, bytes data, address fallbackHandler, address paymentToken, uint256 payment, address payable paymentReceiver) external"
	];

	const safeOwners = [account];
	const signatureThreshold = 1;

	// Whitelist GelatoCore as module script
	const addressTo = "0xf53f625aDE4d53905081cC390845a5f9C2EC137a";

	const whitelistGelatoCoreScriptAbi = [
		"function whitelist(address _gelatoCore)"
	];

	const iFaceSetupModule = new ethers.utils.Interface(
		whitelistGelatoCoreScriptAbi
	);
	const setupModulesPayload = "test"

	// = iFaceSetupModule.encodeFunctionData("whitelist", [
	// 	GELATO_CORE_ADDRESS[networkId]
	// ]);

	const fallbackHandler = ethers.constants.AddressZero;
	const paymentToken = ethers.constants.AddressZero;
	const payment = ethers.constants.Zero;
	const paymentReceiver = ethers.constants.AddressZero;

	const iFaceSetup = new ethers.utils.Interface(setupAbi);

	const setupPayload = "test"
	// const setupPayload = iFaceSetup.encodeFunctionData("setup", [
	// 	safeOwners,
	// 	signatureThreshold,
	// 	addressTo,
	// 	setupModulesPayload,
	// 	fallbackHandler,
	// 	paymentToken,
	// 	payment,
	// 	paymentReceiver
	// ]);
	return [gnosisSafeMasterCopy, setupPayload];
};

export const calculateUniswapPrice = async (
	signer: any,
	sellToken: string,
	ethAmount: ethers.utils.BigNumber
) => {
	const uniswapFactoryAbi = [
		"function getExchange(address token) view returns (address exchange)"
	];

	const uniswapExchangeAbi = [
		"function getTokenToEthInputPrice(uint256 tokens_sold) view returns (uint256 eth_bought)",
		"function getEthToTokenInputPrice(uint256 eth_sold) view returns (uint256 tokens_bought)"
	];

	const uniswapFactoryAddress = "0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95";
	const uniswapFactoryAddressKovan =
		"0xD3E51Ef092B2845f10401a0159B2B96e8B6c3D30";

	const uniswapFactory = new ethers.Contract(
		uniswapFactoryAddressKovan,
		uniswapFactoryAbi,
		signer
	);

	let uniswapExchangeAddress = ethers.constants.AddressZero;
	try {
		uniswapExchangeAddress = await uniswapFactory.getExchange(sellToken);

		const uniswapExchange = new ethers.Contract(
			uniswapExchangeAddress,
			uniswapExchangeAbi,
			signer
		);

		let daiAmount = ethers.constants.Zero;
		try {
			daiAmount = await uniswapExchange.getEthToTokenInputPrice(ethAmount);
			return ethers.utils.bigNumberify(daiAmount);
		} catch (error) {
			console.log(error);
			return ethers.constants.Zero;
		}
	} catch (error) {
		console.log("nope");
		return ethers.constants.Zero;
	}
};
