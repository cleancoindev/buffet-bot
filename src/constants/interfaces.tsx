
export interface WhitelistData {
    id: number;
    app: string;
    title: string;
    address: string;
    inputs: Array<string>;
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
    id: string;
    conditionOrAction: ConditionOrAction;
}

export enum ConditionOrAction {
    Condition,
    Action,
}

export interface MatchParams {
    name: string;
}

export interface StepperProps {
    app: string;
    title: string;
    inputs: Array<string>;
    // Stepper details
    activeSteps: number;
    handleNext: Function;
    handleBack: Function;

}