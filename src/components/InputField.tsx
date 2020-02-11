import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {
	InputType,
	ConditionOrAction,
	ActionWhitelistData,
	ConditionWhitelistData,
	Token,
	ChainIds,
	RelevantInputData
} from '../constants/interfaces';
import DateAndTimePicker from './Inputs/DatePicker';
import TokenSelect from './Inputs/TokenSelect';
import { useIcedTxContext } from '../state/GlobalState';
import {
	UPDATE_CONDITION_INPUTS,
	UPDATE_ACTION_INPUTS,
	INPUT_CSS,
	BIG_NUM_ZERO,
	BIG_NUM_ONE,
	SELECTED_CHAIN_ID,
	SELECTED_NETWORK_NAME
} from '../constants/constants';
import { ethers, BigNumber } from 'ethers';

import {
	getTokenByAddress,
	getTokenList,
	getValueFromSmartContractCondition
} from '../helpers/helpers';

// Number formater
import ReactNumberFormat from './Inputs/ReactNumberFormat';
import { useWeb3React } from '@web3-react/core';
import { isBool, isBigNumber } from '../helpers/typeguards';
import AddressInput from './Inputs/AddressInput';
import StatelessGetValueInput from './Inputs/StatelessGetValue';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		form: {
			marginTop: '24px',
			// display: "flex",
			width: '100%',
			// paddingRight: theme.spacing(3),
			paddingBottom: theme.spacing(2)
		},

		// Import TextField CSS
		...INPUT_CSS
	})
);

interface InputProps {
	inputType: InputType;
	label: string;
	index: number;
	conditionOrAction: ConditionOrAction;
	inputs: Array<string | number | BigNumber | boolean>;
	app: string;
	disabled: boolean;
	condition?: ConditionWhitelistData;
	action?: ActionWhitelistData;
	approveIndex: number;
	relevantInputData: RelevantInputData;
	findTokenBalance?: Function;
}

export default function LayoutTextFields(props: InputProps) {
	// Props
	const {
		app,
		inputType,
		label,
		index,
		conditionOrAction,
		inputs,
		disabled,
		condition,
		action,
		approveIndex,
		relevantInputData,
		findTokenBalance
	} = props;
	// Context

	const { dispatch, icedTxState } = useIcedTxContext();

	const { active, account, library, chainId } = useWeb3React();

	// In case network Id is not defined yet, use default
	let networkId: ChainIds = SELECTED_CHAIN_ID;
	if (chainId !== undefined) {
		networkId = chainId as ChainIds;
	}

	// updateUser Input
	const updateConditionInputs = (index: number, value: any) => {
		// Default Index => @DEV Restructure Dispatcher later
		dispatch({ type: UPDATE_CONDITION_INPUTS, index, value });
	};

	const updateActionInputs = (index: number, value: any) => {
		// Default Index => @DEV Restructure Dispatcher later
		dispatch({ type: UPDATE_ACTION_INPUTS, index, value });
	};

	// Based on whether the input is a condition or action, select a different dispatch function
	let updateUserInput: Function;
	updateUserInput =
		conditionOrAction === ConditionOrAction.Condition
			? updateConditionInputs
			: updateActionInputs;

	// CSS Classes
	const classes = useStyles();

	// call at every new render
	const deriveBool = async () => {
		if (inputs[0] !== undefined) {
			if (inputs[index] !== undefined) {
				if (conditionOrAction === ConditionOrAction.Condition) {
					const shouldBeGreaterForTrue = inputs[
						icedTxState.condition.boolIndex
					] as BigNumber;

					// dependent parameter that determines if greater or smaller

					// Fetching the variable we compare the index value too
					// OLD
					// const getConditionValueInput = icedTxState.condition
					// 	.getConditionValueInput as BigNumber;

					// NEW, direct from smart contract

					const getConditionValueInput = await getValueFromSmartContractCondition(
						icedTxState.condition,
						active,
						networkId,
						account as string,
						inputs
					);

					// Make comparison with bigNumbers

					// If parameter is greater than getConditionValueInput => bool _ isGreater => true
					if (shouldBeGreaterForTrue.gte(getConditionValueInput)) {
						// Set bool to true, only if it's not already true
						if (isBool(inputs[index])) {
							if (inputs[index] === false) {
								// console.log('set to true');
								// console.log('True');
								updateUserInput(index, true);
							} else {
								// console.log('already true, dont set again');
							}
						} else {
							// console.log('Type not bool');
						}
					}
					// If parameter is smaller then getConditionValueInput => bool _isGreater => false
					else {
						// Set bool to false
						if (isBool(inputs[index])) {
							if (inputs[index] === true) {
								// console.log('False');
								// console.log('set to false');
								updateUserInput(index, false);
							} else {
								// console.log('already false, dont set again');
							}
						} else {
							// console.log('Type not bool');
						}
					}
				}
			}
			// If it is undefined, set dummy way
			else {
				// console.log('default false');
				updateUserInput(index, false);
			}
		} else {
			// console.log('default false');
			updateUserInput(index, false);
		}
	};

	// DEFAULT 1
	// If user already inputted values, prefill inputs from state, otherwise display the default values
	// œDEV make default values specific for each condition and action, not global
	function returnDefaultBigInt(): BigNumber {
		// If user has inputted something, go in here
		if (inputs[0] !== undefined) {
			if (inputs[index] !== undefined) {
				// // @DEV isBugNUmber typeguard does not work
				// if (isBigNumber(inputs[index])) {
				// 	console.log('is big number');
				// }
				return inputs[index] as BigNumber;
			} else {
				// Check if the input of the token address is filled, if yes calculate the specific wei amount
				if (inputs[approveIndex] !== undefined) {
					const token = getTokenByAddress(
						inputs[approveIndex] as string,
						networkId,
						relevantInputData
					);
					const defaultWeiAmountPerToken = ethers.utils.parseUnits(
						'1',
						token.decimals
					);

					updateUserInput(index, defaultWeiAmountPerToken);
					return defaultWeiAmountPerToken;
				} else {
					updateUserInput(index, BIG_NUM_ZERO);
					console.log('Zero');
					return BIG_NUM_ZERO;
				}
			}
		}
		// If new render, go in here
		else {
			if (
				ConditionOrAction.Condition === conditionOrAction &&
				icedTxState.condition.id === 3
			) {
				updateUserInput(index, ethers.constants.WeiPerEther);
				return ethers.constants.WeiPerEther;
			} else {
				updateUserInput(index, BIG_NUM_ZERO);
				return BIG_NUM_ZERO;
			}
		}
	}

	const returnDefaultString = (): string => {
		// FETCH FROM STATE
		if (inputs[0] !== undefined) {
			if (inputs[index] !== undefined) {
				return inputs[index] as string;
			}
			// Else, Use default value
			else {
				return getDefaultStringValue();
			}
		} else {
			return getDefaultStringValue();
		}
	};

	const getDefaultStringValue = () => {
		switch (inputType) {
			case InputType.Token:
				const tokenList = getTokenList(relevantInputData, networkId);
				let defaultToken = tokenList[0];
				if (
					ConditionOrAction.Condition === conditionOrAction &&
					icedTxState.condition.id === 3
				) {
					defaultToken = tokenList[1];
					if (index !== 0) defaultToken = tokenList[0];
				} else {
					if (index !== 0) defaultToken = tokenList[1];
				}

				updateUserInput(index, defaultToken.address[networkId]);
				return defaultToken.address[networkId];
			case InputType.Date:
				const date = new Date();
				const timestamp = date.getTime();
				return (timestamp / 1000).toString();
			default:
				return '';
		}
	};

	function renderInput() {
		switch (inputType) {
			case InputType.Date:
				return (
					<div className={classes.form}>
						<DateAndTimePicker
							label={label}
							index={index}
							disabled={disabled}
							defaultValue={returnDefaultString()}
						></DateAndTimePicker>
					</div>
				);
			case InputType.Token:
				return (
					<div className={classes.form}>
						<TokenSelect
							findTokenBalance={findTokenBalance}
							defaultTokenAddress={returnDefaultString()}
							index={index}
							conditionOrAction={conditionOrAction}
							label={label}
							disabled={disabled}
							key={`address-input-${disabled}-${conditionOrAction}-${index}`}
							relevantInputData={relevantInputData}
						/>
					</div>
				);
			case InputType.TokenAmount:
				// Amounts
				return (
					<div className={classes.form}>
						<ReactNumberFormat
							updateUserInput={updateUserInput}
							label={label}
							index={index}
							inputType={inputType}
							inputs={inputs}
							defaultValue={returnDefaultBigInt()}
							disabled={disabled}
							approveIndex={approveIndex}
							conditionOrAction={conditionOrAction}
							key={`tokenAmount-input-${disabled}-${conditionOrAction}-${index}`}
							relevantInputData={relevantInputData}
						></ReactNumberFormat>
					</div>
				);
			case InputType.Number:
				return (
					<div className={classes.form}>
						<ReactNumberFormat
							updateUserInput={updateUserInput}
							label={label}
							index={index}
							inputType={inputType}
							inputs={inputs}
							defaultValue={returnDefaultBigInt()}
							disabled={disabled}
							approveIndex={approveIndex}
							conditionOrAction={conditionOrAction}
							key={`number-input-${disabled}-${conditionOrAction}-${index}`}
							relevantInputData={relevantInputData}
						></ReactNumberFormat>
					</div>
				);
			case InputType.GetValue:
				return (
					<div className={classes.form}>
						<TextField
							className={classes.root}
							style={{ marginTop: '0px', marginBottom: '0px' }}
							id="outlined-full-width"
							label={label}
							// Import TextField CSS
							// placeholder="Placeholder"
							// helperText="Full width!"
							fullWidth
							margin="normal"
							InputLabelProps={{
								shrink: true
							}}
							variant="outlined"
							disabled={true}
						/>
					</div>
				);
			case InputType.Address:
				return (
					<div className={classes.form}>
						<AddressInput
							condition={condition}
							key={`address-input-${disabled}-${conditionOrAction}-${index}`}
							index={index}
							inputType={inputType}
							label={label}
							conditionOrAction={ConditionOrAction.Condition}
							inputs={inputs}
							app={app}
							disabled={disabled}
							approveIndex={index}
							classes={classes}
							updateUserInput={updateUserInput}
						></AddressInput>
					</div>
				);
			case InputType.StatelessGetValue:
				// callGetValueAndSetState();
				// Only display in creation, not summary
				// if (!disabled) {
				return (
					<div className={classes.form}>
						<StatelessGetValueInput
							updateUserInput={updateUserInput}
							label={label}
							index={index}
							inputType={inputType}
							inputs={inputs}
							disabled={disabled}
							approveIndex={approveIndex}
							conditionOrAction={conditionOrAction}
							key={`getValue-input-${conditionOrAction}-${index}`}
							condition={condition}
							action={action}
							relevantInputData={relevantInputData}
						></StatelessGetValueInput>
					</div>
				);
			// } else {
			// 	return <React.Fragment></React.Fragment>;
			// }
			case InputType.Bool:
				// Dont call when showing sumamry
				if (!disabled) {
					deriveBool();
				}
				return <React.Fragment></React.Fragment>;
			default:
				return <div className={classes.form}></div>;
		}
	}

	return renderInput();
	// Import TextField CSS
}
