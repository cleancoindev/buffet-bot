import { ethers, BigNumber } from "ethers";

export interface Params {
	type: string;
	name: string;
}

export interface Addresses {
	1: string;
	3: string;
	4: string;
	42: string;
}

export interface DeprecatedAddresses {
	1: Array<string>;
	3: Array<string>;
	4: Array<string>;
	42: Array<string>;
}

export interface ConditionWhitelistData {
	id: number;
	app: string;
	title: string;
	address: Addresses;
	abi: string;
	params: Array<Params>;
	inputLabels: Array<string>;
	userInputTypes: Array<InputType>;
	relevantInputData: Array<RelevantInputData>;
	userInputs: Array<string | number | BigNumber | boolean>;
	getConditionValueAbi: string;
	getConditionValueInput: BigNumber;
	approveIndex: number;
	boolIndex: number;
	logo: string;
	deprecatedAddresses: DeprecatedAddresses;
}

export interface ActionWhitelistData {
	id: number;
	app: string;
	title: string;
	address: Addresses;
	abi: string;
	params: Array<Params>;
	inputLabels: Array<string>;
	userInputTypes: Array<InputType>;
	getActionValueAbi: string;
	getActionValueInput: BigNumber;
	userInputs: Array<string | number | BigNumber | boolean>;
	relevantInputData: Array<RelevantInputData>;
	approveIndex: number;
	logo: string;
	deprecatedAddresses: DeprecatedAddresses;
}

export interface UserSelection {
	conditionApp: string;
	actionApp: string;
	conditionAppFunctions: Array<ConditionWhitelistData>;
	actionAppFunctions: Array<ActionWhitelistData>;
}

export enum ConditionOrAction {
	Condition,
	Action
}

export enum InputType {
	Date,
	Number,
	TokenAmount,
	Address,
	Token,
	Bool,
	GetValue,
	StatelessGetValue,
	DEFAULT,
	Disabled // Used for the summary
}

// Relevant Data for user inputs

export enum RelevantInputData {
	none = 0
}

export interface MatchParams {
	name: string;
}

export interface Token {
	address: Addresses;
	symbol: string;
	name: string;
	decimals: number;
	max: string;
}

export type KyberToken = Array<Token>;

// Transaction Statea

export type ChainIds = 1 | 3 | 4 | 42;

// Action interfaces
