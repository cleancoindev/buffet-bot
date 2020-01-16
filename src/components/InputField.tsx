import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {
	InputType,
	TriggerOrAction,
	ActionWhitelistData,
	TriggerWhitelistData,
	Token,
	ChainIds
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
import { KYBER_TOKEN_LIST } from '../constants/tokens';
import { ethers } from 'ethers';
import { getTokenByAddress } from '../helpers/helpers';

// Number formater
import ReactNumberFormat from './Inputs/ReactNumberFormat';
import { useWeb3React } from '@web3-react/core';
import { isBool, isBigNumber } from '../helpers/typeguards';
import AddressInput from './Inputs/AddressInput';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		form: {
			marginTop: '24px',
			// display: "flex",
			width: '100%',
			paddingRight: theme.spacing(3),
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
	triggerOrAction: TriggerOrAction;
	inputs: Array<string | number | ethers.utils.BigNumber | boolean>;
	app: string;
	disabled: boolean;
	trigger?: TriggerWhitelistData;
	action?: ActionWhitelistData;
	tokenIndex: number;
}

export default function LayoutTextFields(props: InputProps) {
	// Props
	const {
		app,
		inputType,
		label,
		index,
		triggerOrAction,
		inputs,
		disabled,
		trigger,
		action,
		tokenIndex
	} = props;
	// Context

	const { dispatch, icedTxState } = useIcedTxContext();

	const { active, account, library, chainId } = useWeb3React();

	// In case network Id is not defined yet, use default
	let networkId: ChainIds = SELECTED_CHAIN_ID;
	if (chainId !== undefined) {
		networkId = chainId as ChainIds;
	}

	const [getValueState, setGetValueState] = React.useState(
		icedTxState.trigger.getTriggerValueInput
	);

	// updateUser Input
	const updateTriggerInputs = (index: number, value: any) => {
		// Default Index => @DEV Restructure Dispatcher later
		dispatch({ type: UPDATE_CONDITION_INPUTS, index, value });
	};

	const updateActionInputs = (index: number, value: any) => {
		// Default Index => @DEV Restructure Dispatcher later
		dispatch({ type: UPDATE_ACTION_INPUTS, index, value });
	};

	// Based on whether the input is a trigger or action, select a different dispatch function
	let updateUserInput: Function;
	updateUserInput =
		triggerOrAction === TriggerOrAction.Trigger
			? updateTriggerInputs
			: updateActionInputs;

	// CSS Classes
	const classes = useStyles();

	// Func should call getValue() in smart contract and return the respective value in a disabled Text field
	// Params: Contract address | Contract Parameters
	const callGetValue = async () => {
		// Get abi
		let newValue = icedTxState.trigger.getTriggerValueInput;
		// WHen on summary page, return global state

		if (disabled) return newValue;

		if (trigger && active && account) {
			const abi = trigger.getTriggerValueAbi;
			const triggerAddress = trigger.address[chainId as ChainIds];

			const tokenAddress = inputs[tokenIndex] as string;
			let token: Token;
			try {
				token = getTokenByAddress(tokenAddress, chainId as ChainIds);
			} catch (error) {
				newValue = BIG_NUM_ZERO;
				return newValue;
			}

			try {
				// Find token object by address
				const signer = library.getSigner();

				const triggerContract = new ethers.Contract(
					triggerAddress,
					[abi],
					signer
				);

				// get value
				try {
					newValue = await triggerContract.getTriggerValue(...inputs);
					// Convert fetched wei amount to human reable amount

					// convert Value into human readable form
					return newValue;
				} catch (error) {
					// console.log(error);
					newValue = BIG_NUM_ZERO;
					// console.log(2);
					return newValue;
				}
				//Instantiate contract

				// try {
				// 	newValue = await library.getBalance(account);
				// 	// convert Value into human readable form
				// 	return newValue;
				// } catch (error) {
				// 	newValue = BIG_NUM_ZERO;
				// 	// console.log(1);
				// 	return newValue;
				// }
			} catch (error) {
				// console.log('token not in state yet');
				newValue = BIG_NUM_ZERO;
				// console.log(3);
				return newValue;
			}
		} else {
			newValue = BIG_NUM_ZERO;
			// console.log(4);
			return newValue;
		}
	};

	async function callGetValueAndSetState() {
		// Only at first render set state, otherwise infinite loop

		if (inputs[0] !== undefined) {
			const returnValue = await callGetValue();
			// updateUserInput(index, returnValue);
			// Only set state if the return value is different
			if (!returnValue.eq(getValueState)) {
				setGetValueState(returnValue);
			}
		}
	}

	// call at every new render
	const deriveBool = () => {
		if (inputs[0] !== undefined) {
			if (inputs[index] !== undefined) {
				if (triggerOrAction === TriggerOrAction.Trigger) {
					const shouldBeGreaterForTrue = inputs[
						icedTxState.trigger.boolIndex
					] as ethers.utils.BigNumber;

					// dependent parameter that determines if greater or smaller

					// getTriggerValueInput independent variable
					const getTriggerValueInput = icedTxState.trigger
						.getTriggerValueInput as ethers.utils.BigNumber;

					// Make comparison with bigNumbers

					// If parameter is greater than getTriggerValueInput => bool _ isGreater => true
					if (shouldBeGreaterForTrue.gte(getTriggerValueInput)) {
						// Set bool to true, only if it's not already true
						if (isBool(inputs[index])) {
							if (inputs[index] === false) {
								// console.log('set to true');
								updateUserInput(index, true);
							} else {
								// console.log('already true, dont set again');
							}
						} else {
							// console.log('Type not bool');
						}
					}
					// If parameter is smaller then getTriggerValueInput => bool _isGreater => false
					else {
						// Set bool to false
						if (isBool(inputs[index])) {
							if (inputs[index] === true) {
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
	// œDEV make default values specific for each trigger and action, not global
	function returnDefaultBigInt(): ethers.utils.BigNumber {
		const ZERO = ethers.constants.Zero;
		// If user has inputted something, go in here
		if (inputs[0] !== undefined) {
			if (inputs[index] !== undefined) {
				// @DEV isBugNUmber typeguard does not work
				if (isBigNumber(inputs[index])) {
					console.log('is big number');
				}
				return inputs[index] as ethers.utils.BigNumber;
			} else {
				updateUserInput(index, BIG_NUM_ONE);
				return BIG_NUM_ONE;
			}
		}
		// If new render, go in here
		else {
			updateUserInput(index, BIG_NUM_ONE);
			return BIG_NUM_ONE;
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
				let defaultToken = KYBER_TOKEN_LIST[0];
				if (index !== 0) defaultToken = KYBER_TOKEN_LIST[1];
				console.log(defaultToken);
				console.log(networkId);
				console.log(defaultToken.address[networkId]);
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
							defaultTokenAddress={returnDefaultString()}
							index={index}
							triggerOrAction={triggerOrAction}
							label={label}
							disabled={disabled}
							key={`address-input-${disabled}-${triggerOrAction}-${index}`}
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
							convertToWei
							disabled={disabled}
							tokenIndex={tokenIndex}
							triggerOrAction={triggerOrAction}
							key={`tokenAmount-input-${disabled}-${triggerOrAction}-${index}`}
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
							convertToWei={false}
							disabled={disabled}
							tokenIndex={tokenIndex}
							triggerOrAction={triggerOrAction}
							key={`number-input-${disabled}-${triggerOrAction}-${index}`}
						></ReactNumberFormat>
					</div>
				);
			case InputType.GetValue:
				return (
					<div className={classes.form}>
						<TextField
							className={classes.root}
							required
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
							trigger={trigger}
							key={`address-input-${disabled}-${triggerOrAction}-${index}`}
							index={index}
							inputType={inputType}
							label={label}
							triggerOrAction={TriggerOrAction.Trigger}
							inputs={inputs}
							app={app}
							disabled={disabled}
							tokenIndex={index}
							classes={classes}
							updateUserInput={updateUserInput}
						></AddressInput>
					</div>
				);
			case InputType.StatelessGetValue:
				callGetValueAndSetState();
				// Only display in creation, not summary
				if (!disabled) {
					return (
						<div className={classes.form}>
							<ReactNumberFormat
								updateUserInput={updateUserInput}
								label={label}
								index={index}
								inputType={inputType}
								inputs={inputs}
								defaultValue={getValueState}
								convertToWei
								disabled={true}
								tokenIndex={tokenIndex}
								triggerOrAction={triggerOrAction}
								key={`getValue-input-${disabled}-${triggerOrAction}-${index}`}
							></ReactNumberFormat>
						</div>
					);
				} else {
					return <React.Fragment></React.Fragment>;
				}
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
