import { ethers, BigNumber } from "ethers";

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
	all = 4,
	allWithEth = 5
}

export interface MatchParams {
	name: string;
}

export interface StepperContentProps {
	findTokenBalance: Function;
	activeStep: number;
	classes: Record<string, string>;
	icedTxState: IcedTx;
}

export interface StepperProps {
	findTokenBalance: Function;
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
	postApprove = 10,
	displayCreate = 11,
	preCreate = 12,
	waitingCreate = 13,
	postCreate = 14,
	displayCancel = 15,
	preCancel = 16,
	waitingCancel = 17,
	postCancel = 18,
	cancelled = 19,
	insufficientBalance = 20,
	inputError = 21
}

export type ChainIds = 1 | 3 | 4 | 42;

// Action interfaces
