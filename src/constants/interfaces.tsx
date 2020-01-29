import {
	SELECT_CONDITION,
	SELECT_ACTION,
	UPDATE_CONDITION_INPUTS,
	RESET_CONDITION,
	RESET_ACTION,
	UPDATE_ACTION_INPUTS,
	UPDATE_TX_STATE,
	UPDATE_PAST_TRANSACTIONS,
	OPEN_MODAL,
	CLOSE_MODAL,
	CANCEL_EXECUTION_CLAIM,
	INPUT_ERROR,
	INPUT_OK,
	UPDATE_GET_VALUE_INPUT
} from './constants';
import { ethers } from 'ethers';

/* We need
	address _selectedExecutor,
	uint256 _executionClaimId,
	IGelatoUserProxy _userProxy,
	IGelatoCondition _condition,
	bytes calldata _conditionPayloadWithSelector,
	IGelatoAction _action,
	bytes calldata _actionPayloadWithSelector,
	uint256[3] calldata _conditionGasActionTotalGasMinExecutionGas,
	uint256 _executionClaimExpiryDate,
	uint256 _mintingDeposit


*/

export interface PastTransaction {
	id: string;
	executionClaimId: string;
	selectedExecutor: string;
	proxyAddress: string;
	condition: string;
	conditionPayload: string;
	action: string;
	actionPayload: string;
	expiryDate: string;
	prepayment: string;
	// Graph specific values
	mintingDate: string;
	executionDate?: string;
	status: string;
	conditionGasActionTotalGasMinExecutionGas: Array<number>;
	executionHash: string;
}

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
	userInputs: Array<string | number | ethers.utils.BigNumber | boolean>;
	getConditionValueAbi: string;
	getConditionValueInput: ethers.utils.BigNumber;
	approveIndex: number;
	boolIndex: number;
	logo: string;
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
	userInputs: Array<string | number | ethers.utils.BigNumber | boolean>;
	relevantInputData: Array<RelevantInputData>;
	approveIndex: number;
	logo: string;
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
	modalOpen: boolean;
	pastTransactionId: string;
	error: Error;
}

export interface Error {
	isError: boolean;
	msg: string;
	origin: number;
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
	none = 0,
	kyberTokenList = 1,
	kyberTokenListWithEth = 2,
	fulcrumTokenList = 3,
	all = 4
}

export interface MatchParams {
	name: string;
}

export interface StepperContentProps {
	activeStep: number;
	classes: Record<string, string>;
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
	preTxCheck: Function;
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
export enum TxState {
	displayMobile = 0,
	displayInstallMetamask = 1,
	displayLogIntoMetamask = 2,
	displayWrongNetwork = 3,
	displayGelatoWallet = 4,
	preGelatoWallet = 5,
	waitingGelatoWallet = 6,
	postGelatoWallet = 7,
	displayApprove = 8,
	preApprove = 9,
	displayCreate = 10,
	preCreate = 11,
	waitingCreate = 12,
	postCreate = 13,
	displayCancel = 14,
	preCancel = 15,
	waitingCancel = 16,
	postCancel = 17,
	cancelled = 18,
	insufficientBalance = 19,
	inputError = 20
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

interface OpenModal {
	type: typeof OPEN_MODAL;
}

interface CloseModal {
	type: typeof CLOSE_MODAL;
}

interface UpdateSelectedTx {
	type: typeof CANCEL_EXECUTION_CLAIM;
	pastTransactionId: string;
}

interface InputError {
	type: typeof INPUT_ERROR;
	msg: string;
	origin: number;
	txState: TxState;
}

interface InputOk {
	type: typeof INPUT_OK;
	txState: TxState;
}

interface UpdateGetValueInput {
	type: typeof UPDATE_GET_VALUE_INPUT;
	newGetValueInput: ethers.utils.BigNumber;
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
	| UpdatePastTransactions
	| OpenModal
	| CloseModal
	| UpdateSelectedTx
	| InputError
	| InputOk
	| UpdateGetValueInput;
