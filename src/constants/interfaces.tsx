import {
	SELECT_CONDITION,
	SELECT_ACTION,
	UPDATE_CONDITION_INPUTS,
	RESET_CONDITION,
	RESET_ACTION,
	UPDATE_ACTION_INPUTS,
	UPDATE_TX_STATE,
	UPDATE_PAST_TRANSACTIONS
} from './constants';
import { Dispatch, SetStateAction } from 'react';
import { ethers } from 'ethers';

export interface PastTransaction {
	id: string;
	conditionAddress: string;
	actionAddress: string;
	conditionPayload: string;
	actionPayload: string;
	expiryDate: string;
	prepayment: string;
	timestamp: string;
	status: string;
}

export interface Params {
	type: string;
	name: string;
}

export interface ActionWhitelistData {
	id: number;
	app: string;
	title: string;
	address: string;
	params: Array<Params>;
	inputLabels: Array<string>;
	userInputTypes: Array<InputType>;
	userInputs: Array<string | number>;
	approvalIndex: number;
}

export interface ConditionWhitelistData {
	id: number;
	app: string;
	title: string;
	address: string;
	params: Array<Params>;
	inputLabels: Array<string>;
	userInputTypes: Array<InputType>;
	userInputs: Array<string | number>;
}

export interface UserSelection {
	conditionApp: string;
	actionApp: string;
	conditionAppFunctions: Array<ConditionWhitelistData>;
	actionAppFunctions: Array<ActionWhitelistData>;
}

export interface IcedTx {
	condition: ConditionWhitelistData;
	action: ActionWhitelistData;
	txState: TxState;
	pastTransactions: Array<PastTransaction>;
}

export enum ConditionOrAction {
	Condition,
	Action
}

export enum InputType {
	Date,
	Number,
	Address,
	Token,
	Bool,
	GetValue,
	StatelessGetValue,
	DEFAULT,
	Disabled // Used for the summary
}

export interface MatchParams {
	name: string;
}

export interface StepperContentProps {
	activeStep: number;
	classes: Record<string, string>;
	inputs: Array<string>;
	icedTxState: IcedTx;
}

export interface StepperProps {
	// Stepper details
	activeStep: number;
	handleNext: (event: React.MouseEvent<HTMLButtonElement>) => void;
	handleBack: (event: React.MouseEvent<HTMLButtonElement>) => void;
	handleReset: (event: React.MouseEvent<HTMLButtonElement>) => void;
	modalOpen: boolean;
	modalClickOpen: (event: React.MouseEvent<HTMLButtonElement>) => void;
	modalClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
	steps: Array<string>;
	icedTxState: IcedTx;
}

export interface Token {
	address: string;
	symbol: string;
	name: string;
	decimals: number;
}

export type KyberToken = Array<Token>;

// Transaction Statea
export enum TxState {
	displayInstallMetamask = 0,
	displayLogIntoMetamask = 1,
	displayGelatoWallet = 2,
	preGelatoWallet = 3,
	waitingGelatoWallet = 4,
	postGelatoWallet = 5,
	displayApprove = 6,
	preApprove = 7,
	displayCreate = 8,
	preCreate = 9,
	waitingCreate = 10,
	postCreate = 11,
	cancelled = 12,
	insufficientBalance = 13
	// waitingApprove,
	// postApprove,
}

export type ChainIds = 1 | 3 | 4 | 42;

// Action interfaces

interface SelectAction {
	// UPDATE_ACTION
	type: typeof SELECT_ACTION;
	// Id of Action
	id: string;
}

interface SelectCondition {
	// UPDATE_ACTION
	type: typeof SELECT_CONDITION;
	// Id of Action
	id: string;
}

interface UpdateConditionInputs {
	// UPDATE_ACTION
	type: typeof UPDATE_CONDITION_INPUTS;
	// Id of Action
	index: number;
	value: any;
}

interface UpdateActionInputs {
	// UPDATE_ACTION
	type: typeof UPDATE_ACTION_INPUTS;
	// Id of Action
	index: number;
	value: any;
}

interface ResetCondition {
	// UPDATE_ACTION
	type: typeof RESET_CONDITION;
}

interface ResetAction {
	// UPDATE_ACTION
	type: typeof RESET_ACTION;
}

interface UpdateTxState {
	type: typeof UPDATE_TX_STATE;
	txState: TxState;
}

interface UpdatePastTransactions {
	type: typeof UPDATE_PAST_TRANSACTIONS;
	pastTransactions: Array<PastTransaction>;
}

// export interface Action {
// 	type: string;
// 	conditionOrAction: ConditionOrAction;
// 	id: string;
// 	index: number;
// 	value: string | number;
// }

export type Action =
	| ResetCondition
	| ResetAction
	| UpdateActionInputs
	| UpdateConditionInputs
	| SelectCondition
	| SelectAction
	| UpdateTxState
	| UpdatePastTransactions;
