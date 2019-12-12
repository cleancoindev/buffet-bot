import { InputType } from "./interfaces";

export const APPS = {
	conditions: ["Wallet", "Calendar", "Kyber"],
	actions: ["Wallet", "Kyber", "Fulcrum"]
};


export const CTYPES = [
    { id: 1, app: "Wallet", title: "Token Balance", address: "0x0", params: ["uint256", "address", "ERC20", "bool"], userInputTypes: [InputType.Token, InputType.Number], inputLabels: ["Token", "Increase in Balance (input 0 for any increase)"], userInputs: [""] },
    { id: 3, app: "Kyber", title: "Price", address: "0x0", params: ["uint256", "address", "ERC20", "bool"], userInputTypes: [InputType.Token, InputType.Token, InputType.Number, InputType.Number], inputLabels: ["Sell Token", "Buy Token", "Sell Amount (default 1)", "Price"], userInputs: [""]  },
    { id: 4, app: "Calendar", title: "Time", address: "0x0", params: ["uint256"], userInputTypes: [InputType.Date], inputLabels: ["Input Date and Time"], userInputs: [""] }
];

export const ATYPES = [
    { id: 1, app: "Wallet", title: "Send Token", address: "0x0", params: ["uint256", "address", "ERC20", "bool"], userInputTypes: [InputType.Date], inputLabels: [""], userInputs: [""] },
    { id: 2, app: "Kyber", title: "Trade Tokens", address: "0x0", params: ["uint256", "address", "ERC20", "bool"], userInputTypes: [InputType.Token, InputType.Token, InputType.Number], inputLabels: ["Sell Token", "Buy Token", "Sell Amount"],  userInputs: [""] },
    { id: 3, app: "Fulcrum", title: "Margin Trade Tokens", address: "0x0", params: ["uint256", "address", "ERC20", "bool"], userInputTypes: [InputType.Token], inputLabels: [""], userInputs: [""]  }
];

/*
export const LIST = {
	conditions: {
		Wallet: {
			tokenBalance: {
				title: "Token Balance",
				address: "0x0"
			},
			etherBalance: {
				title: "Ether Balance",
				address: "0x0"
			}
		},
		Calendar: {
			time: {
				title: "Time",
				address: "0x0"
			}
		},
		Kyber: {
			price: {
				title: "Price",
				address: "0x0"
			}
		}
	},
	actions: {
		Wallet: {
			sendToken: {
				title: "Send Token to address",
				address: "0x0"
			}
		},
		Kyber: {
			swap: {
				title: "Swap Token",
				address: "0x0"
			}
		},
		Fulcrum: {
			marginTrade: {
				title: "Margin Trade",
				address: "0x0"
			}
		}
	}
};

*/
