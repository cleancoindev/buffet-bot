export interface WhitelistData {
	id: number;
	app: string;
	title: string;
	address: string;
	params: Array<string>;
	inputLabels: Array<string>;
	userInputTypes: Array<InputType>;
	userInputs: Array<string | number>;
}

export interface UserSelection {
	conditionApp: string;
	actionApp: string;
	conditionAppFunctions: Array<WhitelistData>;
	actionAppFunctions: Array<WhitelistData>;
}

export interface IcedTx {
	condition: WhitelistData;
	action: WhitelistData;
}

export interface Action {
	type: string;
	conditionOrAction: ConditionOrAction;
	id: string;
	index: number;
	value: string | number;
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
	preApprove,
	waitingApprove,
	postApprove,
	preCreate,
	waitingCreate,
	postCreate,
	Cancelled,
	InsufficientBalance
}
