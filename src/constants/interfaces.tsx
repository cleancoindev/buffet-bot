
import {MouseEvent} from 'react'

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
    handleBack: (event: React.MouseEvent<HTMLButtonElement>) => void
    handleReset: (event: React.MouseEvent<HTMLButtonElement>) => void
    steps: Array<string>;
    icedTxState: IcedTx;
}