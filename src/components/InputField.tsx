import React, { Dispatch, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {
	InputType,
	TriggerOrAction,
	ActionWhitelistData,
	TriggerWhitelistData,
	TxState
} from '../constants/interfaces';
import DateAndTimePicker from './Inputs/DatePicker';
import TokenSelect from './Inputs/TokenSelect';
import { useIcedTxContext } from '../state/GlobalState';
import {
	UPDATE_CONDITION_INPUTS,
	UPDATE_ACTION_INPUTS,
	INPUT_CSS,
	INPUT_ERROR,
	INPUT_OK,
	DEFAULT_DATA_TRIGGER,
	BIG_NUM_ZERO,
	BIG_NUM_ONE
} from '../constants/constants';
import { TOKEN_LIST } from '../constants/whitelist';
import { ethers } from 'ethers';
import { getTokenByAddress, isEth } from '../helpers/helpers';

// Number formater
import ReactNumberFormat from './Inputs/ReactNumberFormat';
import { useWeb3React } from '@web3-react/core';
import { userInfo } from 'os';
import { isBool, isBigNumber, isString } from '../helpers/typeguards';

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

	const { active, account, library } = useWeb3React();

	const [getValueState, setGetValueState] = React.useState(
		icedTxState.trigger.getTriggerValueInput
	);

	// Error Bool, default false
	// Applied to:
	// // Address
	const [error, setError] = React.useState(false);

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
			const triggerAddress = trigger.address;

			const tokenAddress = inputs[tokenIndex];

			let token = getTokenByAddress(tokenAddress.toString());

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
								console.log('set to true');
								updateUserInput(index, true);
							} else {
								console.log('already true, dont set again');
							}
						} else {
							console.log('Type not bool');
						}
					}
					// If parameter is smaller then getTriggerValueInput => bool _isGreater => false
					else {
						// Set bool to false
						if (isBool(inputs[index])) {
							if (inputs[index] === true) {
								console.log('set to false');
								updateUserInput(index, false);
							} else {
								console.log('already false, dont set again');
							}
						} else {
							console.log('Type not bool');
						}
					}
				}
			}
			// If it is undefined, set dummy way
			else {
				console.log('default false');
				updateUserInput(index, false);
			}
		} else {
			console.log('default false');
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
				// If the inputted value is of inputType TokenAmount
				// if (inputType === InputType.TokenAmount) {
				// 	const tokenAddress = inputs[tokenIndex];

				// 	// Find token object by address
				// 	// Find token object by address
				// 	// let token = getTokenByAddress(tokenAddress.toString());
				// 	// console.log(inputs[index]);
				// 	// const humanReadableAmount = ethers.utils.formatUnits(
				// 	// 	inputs[index].toString(),
				// 	// 	token.decimals
				// 	// );

				// 	// console.log(humanReadableAmount);

				// 	// return ethers.utils.bigNumberify(humanReadableAmount);
				// 	return inputs[index] as ethers.utils.BigNumber;
				// } else if (isBigNumber(inputs[index])) {
				// 	updateUserInput(index, ZERO);
				// 	return inputs[index] as ethers.utils.BigNumber;
				// } else {
				// 	throw Error('failed to fetch input from state');
				// }
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
			case InputType.Address:
				let defaultAddress = '';
				if (account) {
					defaultAddress = account;
				} else {
					defaultAddress = '0x0';
					dispatch({
						type: INPUT_ERROR,
						msg: `Input field '${label}' hat to be a correct Ethereum address`
					});
				}
				updateUserInput(index, defaultAddress);
				return defaultAddress;
			case InputType.Token:
				let defaultToken = TOKEN_LIST[0];
				if (index !== 0) defaultToken = TOKEN_LIST[1];
				updateUserInput(index, defaultToken.address);
				console.log(defaultToken.address);
				return defaultToken.address;
			case InputType.Date:
				const date = new Date();
				const timestamp = date.getTime();
				return (timestamp / 1000).toString();
			default:
				return '';
		}
	};

	// Used to validate address

	const handleAddressChange = (event: React.ChangeEvent<{ value: any }>) => {
		const newAddress = event.target.value;

		// Validate address
		try {
			ethers.utils.getAddress(newAddress);
			setError(false);
			if (icedTxState.error.isError) {
				dispatch({ type: INPUT_OK });
			}
		} catch (error) {
			setError(true);
			if (!icedTxState.error.isError) {
				console.log('Error');
				console.log(icedTxState.txState);
				dispatch({
					type: INPUT_ERROR,
					msg: `Input field '${label}' hat to be a correct Ethereum address`
				});
			}
		}

		// Update global state
		updateUserInput(index, newAddress);
		//
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
							defaultToken={returnDefaultString()}
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
						{/* <TextField
							className={classes.root}
							inputProps={{ min: 0 }}
							required
							id="outlined-full-width"
							label={label}
							style={{ marginTop: '0px', marginBottom: '0px' }}
							// Import TextField CSS
							defaultValue={returnDefaultValue()}
							// placeholder="1"
							// helperText="Full width!"
							fullWidth
							onChange={handleChangeNumber}
							margin="normal"
							type="number"
							InputLabelProps={{
								shrink: true
							}}
							variant="outlined"
							disabled={disabled}
						/> */}
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
						<TextField
							className={classes.root}
							required
							style={{ marginTop: '0px', marginBottom: '0px' }}
							id="outlined-full-width"
							label={label}
							defaultValue={returnDefaultString()}
							onChange={handleAddressChange}
							error={error}
							key={`address-input-${disabled}-${triggerOrAction}-${index}`}
							// helperText="Full width!"
							// Import TextField CSS
							margin="normal"
							InputLabelProps={{
								shrink: true
							}}
							variant="outlined"
							disabled={disabled}
						/>
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
