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
	trigger: string;
	action: string;
	triggerPayload: string;
	actionPayload: string;
	expiryDate?: string;
	prepayment?: string;
	mintingDate: string;
	executionDate?: string;
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
	userInputs: Array<string | number | ethers.utils.BigNumber>;
	approvalIndex: number;
}

export interface TriggerWhitelistData {
	id: number;
	app: string;
	title: string;
	address: string;
	params: Array<Params>;
	inputLabels: Array<string>;
	userInputTypes: Array<InputType>;
	userInputs: Array<string | number | ethers.utils.BigNumber>;
}

export interface UserSelection {
	triggerApp: string;
	actionApp: string;
	triggerAppFunctions: Array<TriggerWhitelistData>;
	actionAppFunctions: Array<ActionWhitelistData>;
}

export interface IcedTx {
	trigger: TriggerWhitelistData;
	action: ActionWhitelistData;
	txState: TxState;
	pastTransactions: Array<PastTransaction>;
}

export enum TriggerOrAction {
	Trigger,
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

interface SelectTrigger {
	// UPDATE_ACTION
	type: typeof SELECT_CONDITION;
	// Id of Action
	id: string;
}

interface UpdateTriggerInputs {
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

interface ResetTrigger {
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
// 	triggerOrAction: TriggerOrAction;
// 	id: string;
// 	index: number;
// 	value: string | number;
// }

export type Action =
	| ResetTrigger
	| ResetAction
	| UpdateActionInputs
	| UpdateTriggerInputs
	| SelectTrigger
	| SelectAction
	| UpdateTxState
	| UpdatePastTransactions;
