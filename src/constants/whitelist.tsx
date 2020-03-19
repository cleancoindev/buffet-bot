import { InputType, RelevantInputData } from "./interfaces";
import { ethers } from "ethers";

const BIG_NUM_ZERO = ethers.constants.Zero;

const EMPTY_STRING_ARRAY: Array<string> = [];

// GENERAL NOTES
/*
- use 'address' in params instead of ERC20, as the decoder function most likely does not know what address is

*/

// Smart Contract Addresses
export const GELATO_CORE_ADDRESS = {
	1: "0x4E2Ca0093028C8401C93AaCcCaF59288CA6fb728",
	3: "0x563700A8A6740C8a474DF8F289716afDc30ED07a",
	4: "0x501aF774Eb578203CC34E7171273124A93706C06",
	// old 0x2b4Bd5d0df60aaE4D68B5a4e315be0bdf72cf765
	42: "0x4e4f3d95CC4920f1D6e8fb433a9Feed3C8f3CC31"
};

export const EXECUTOR_ADDRESS = {
	1: "0x4B7363b8a7DaB76ff73dFbA00801bdDcE699F3A2",
	3: "0x203AdbbA2402a36C202F207caA8ce81f1A4c7a72",
	4: "0x203AdbbA2402a36C202F207caA8ce81f1A4c7a72",
	// old 0x203AdbbA2402a36C202F207caA8ce81f1A4c7a72
	42: "0x99E69499973484a96639f4Fb17893BC96000b3b8"
};

export const SCRIPT_ENTER_PORTFOLIO_REBALANCING = {
	1: "0x0",
	3: "0x0",
	4: "0x0",
	42: "0x882E8963F45B7bC1E817B6Dca43916ca343b92F9"
};

export const SCRIPT_EXIT_PORTFOLIO_REBALANCING = {
	1: "0x0",
	3: "0x0",
	4: "0x0",
	42: "0xc5006243ac1AbF38f0536272408B1F6E3f96933d"
};


export const SELECTED_PROVIDER_AND_EXECUTOR = {
	1: [
		"0x0",
		"0x0"
	],
	3: [
		"0x0",
		"0x0"
	],
	4: [
		"0x0",
		"0x0"
	],
	42: [
		"0x518eAa8f962246bCe2FA49329Fe998B66d67cbf8",
		"0x99E69499973484a96639f4Fb17893BC96000b3b8"
	]
}

export const CONDITION_AND_ACTION = {
	1: [
		"0x0",
		"0x0"
	],
	3: [
		"0x0",
		"0x0"
	],
	4: [
		"0x0",
		"0x0"
	],
	42: [
		"0xf5aF30e4022698314e07514CE649fa7f45Cc8F87",
		"0x6199B69Fa71BDA8865CF0226ab464cE596ee10c0"
	]
}


export const EXECUTION_CLAIM_EXPIRY_DATE = 0

export const MASTERCOPY = "0x34CfAC646f301356fAa8B21e94227e3583Fe3F5F"

export const PAYABLE_FACTORY = {
	1: "0x0",
	3: "0x0",
	4: "0x0",
	// old 0x203AdbbA2402a36C202F207caA8ce81f1A4c7a72
	42: "0x877928dB2405A4C2d400F787b56258923464f586"
}



// NOTES

// Input Type Numbers and StatelessGetValue both might use arbitrary decimals as conversions when reading data from Blockchain as BNs and converting them to human readble form, as conditions such as Kyber Price dont return vlaues based on buyToken decimals, but simply always with 18 decimals

// Conditions
export const TTYPES = [
	// Greed Oracle
	{
		id: 4,
		app: "Greed",
		title: "Oracle",
		address: {
			1: "0x0",
			3: "0x0",
			4: "",
			42: "0x01697631e006D76FcD22EEe0aAA7b3b4B42b6819"
		},
		params: [{ type: "uint256", name: "_prevIndex" }],
		userInputTypes: [InputType.Number],
		abi: "function reached(uint256 _prevIndex) returns(bool, string)",
		getConditionValueAbi: "function getConditionValue() view returns (uint256)",
		// Always 0
		approveIndex: 0,
		boolIndex: 3,
		getConditionValueInput: BIG_NUM_ZERO,
		inputLabels: ["Sell Token"],
		userInputs: EMPTY_STRING_ARRAY,
		relevantInputData: [RelevantInputData.none],
		logo: "/images/kyber_logo.png",
		deprecatedAddresses: {
			1: [""],
			3: [""],
			4: [""],
			42: ["0x0"]
		}
	}
];

// Actions
export const ATYPES = [
	//  Portfolio rebalancing
	{
		id: 10,
		app: "Greed",
		title: "ActionRebalancePortfolio",
		address: {
			1: "0x0",
			3: "0x0",
			4: "0x0",
			42: "0x52DfF1E40D080f65aC7A7ed06D00EC73A4182E47"
		},
		params: [],
		abi: "function action()",
		userInputTypes: [],
		inputLabels: [],
		relevantInputData: [],

		userInputs: EMPTY_STRING_ARRAY,
		approveIndex: 0,
		logo: "/images/fulcrum_logo.png",
		getActionValueAbi:
			"function getUsersSendTokenBalance(address _user, address _userProxy, address _pTokenAddress, uint256, address) view returns (uint256)",
		getActionValueInput: BIG_NUM_ZERO,
		deprecatedAddresses: {
			1: [""],
			3: [""],
			4: [""],
			42: ["0x0"]
		}
	}
];

export const USER_WHITELIST = [""];
