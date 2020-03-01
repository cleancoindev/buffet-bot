import { InputType, RelevantInputData } from "./interfaces";
import { ethers, BigNumber } from "ethers";

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
	42: "0x45F205Eb29310B6Fb92893d938Cc1738001210e8"
};

export const EXECUTOR_ADDRESS = {
	1: "0x4B7363b8a7DaB76ff73dFbA00801bdDcE699F3A2",
	3: "0x203AdbbA2402a36C202F207caA8ce81f1A4c7a72",
	4: "0x203AdbbA2402a36C202F207caA8ce81f1A4c7a72",
	// old 0x203AdbbA2402a36C202F207caA8ce81f1A4c7a72
	42: "0x4d671CD743027fB5Af1b2D2a3ccbafA97b5B1B80"
};

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
		title: "Sell Leverage Tokens on Fulcrum",
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
