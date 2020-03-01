import { InputType, Params, RelevantInputData } from "./interfaces";
import { ethers, BigNumber } from "ethers";
import { EXECUTOR_ADDRESS } from "./whitelist";

export const EMPTY_USER_INPUT_ARRAY: Array<
	string | number | BigNumber | boolean
> = [];
export const EMPTY_USER_INPUT_TYPE_ARRAY: Array<InputType> = [];

export const EMPTY_PARAM_ARRAY: Array<Params> = [];
export const EMPTY_STRING_ARRAY: Array<string> = [];
export const EMPTY_RELEVANT_INPUT_DATA_ARRAY: Array<RelevantInputData> = [];

export const BIG_NUM_ZERO = ethers.constants.Zero;
export const BIG_NUM_ONE = ethers.constants.One;

export const MAX_BIG_NUM = BigNumber.from(10).pow(BigNumber.from(50));

// Currently: $275
export const TOKEN_TRANSFER_CEILING = ethers.utils.parseUnits("275", 18);
// Currently: $2
export const TOKEN_TRANSFER_BOTTOM = ethers.utils.parseUnits("2", 18);

export const COLOURS = {
	salmon: "#E91E63",
	salmon60: "#E91E6399",
	salmon50: "#E91E6380",
	pink: "#E50078"
};

export const BOX = {
	border: `1.5px solid ${COLOURS.salmon}`,
	borderRadius: "1px 1px 1px 1px"
};

export const ETH = {
	address: {
		1: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
		3: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
		4: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
		42: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE"
	},
	symbol: "ETH",
	name: "Ether",
	decimals: 18,
	max: "1.53"
};

// export const DEFAULT_CHAIN_ID = 1;
// export const SELECTED_NETWORK_NAME = 'Mainnet';
export const POSSIBLE_CHAIN_IDS = [1, 42];
export const DEFAULT_CHAIN_ID = 42;
export const SELECTED_NETWORK_NAME = "Kovan";

export const DEFAULT_DATA_CONDITION = {
	id: 0,
	app: "",
	title: "",
	address: { 1: "", 3: "", 4: "", 42: "" },
	params: EMPTY_PARAM_ARRAY, // [ ]
	abi: "",
	getConditionValueAbi: "",
	getConditionValueInput: BIG_NUM_ZERO,
	approveIndex: 999,
	inputLabels: EMPTY_STRING_ARRAY, // [ ]
	userInputTypes: EMPTY_USER_INPUT_TYPE_ARRAY, // [ ]
	userInputs: EMPTY_USER_INPUT_ARRAY, // [ ]
	boolIndex: 999,
	relevantInputData: EMPTY_RELEVANT_INPUT_DATA_ARRAY,
	logo:
		"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png",
	deprecatedAddresses: {
		1: [""],
		3: [""],
		4: [""],
		42: [""]
	}
};

export const DEFAULT_DATA_ACTION = {
	id: 0,
	app: "",
	title: "",
	address: { 1: "", 3: "", 4: "", 42: "" },
	params: EMPTY_PARAM_ARRAY, // [ ]
	abi: "",
	getActionValueAbi: "",
	getActionValueInput: BIG_NUM_ZERO,
	inputLabels: EMPTY_STRING_ARRAY, // [ ]
	userInputTypes: EMPTY_USER_INPUT_TYPE_ARRAY, // [ ]
	userInputs: EMPTY_USER_INPUT_ARRAY, // [ ]
	approveIndex: 999, // 999 means no approval in action
	relevantInputData: EMPTY_RELEVANT_INPUT_DATA_ARRAY,
	logo:
		"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
};

export const INPUT_CSS = {
	root: {
		width: "100%",
		"& input:valid + fieldset": {
			borderColor: COLOURS.salmon,
			borderWidth: 1,
			fontSize: "18px"
		},
		// '& input:invalid + fieldset': {
		// 	borderColor: 'red',
		// 	borderWidth: 2
		// },
		// '& input:valid:focus + fieldset': {
		// 	borderLeftWidth: 6,
		// 	padding: '4px !important', // override inline-style
		// 	borderColor: 'green'
		// },
		"& .MuiOutlinedInput-root": {
			color: "white",
			fontSize: "18px",
			// '& fieldset': {
			// 	borderColor: 'red'
			// },
			"&:hover fieldset": {
				borderColor: "white"
			}
			// '&.Mui-focused fieldset': {
			// 	borderColor: COLOURS.salmon
			// }
		},
		"& .MuiOutlinedInput-root.Mui-disabled": {
			fontSize: "18px",
			"& fieldset": {
				borderColor: "#72627b",
				borderWidth: 1
			},
			"&:hover fieldset": {
				borderColor: "#72627b"
			}
		},
		"& .MuiFormLabel-root": {
			fontSize: "18px",
			color: "white !important"
		}
	}
};
