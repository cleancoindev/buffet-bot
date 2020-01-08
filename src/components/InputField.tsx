import React, { Dispatch } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { InputType, ConditionOrAction } from '../constants/interfaces';
import DateAndTimePicker from './Inputs/DatePicker';
import TokenSelect from './Inputs/TokenSelect';
import { useIcedTxContext } from '../state/GlobalState';
import {
	UPDATE_CONDITION_INPUTS,
	UPDATE_ACTION_INPUTS,
	INPUT_CSS
} from '../constants/constants';
import { TOKEN_LIST } from '../constants/whitelist';
import { ethers } from 'ethers';
import { getTokenByAddress } from '../helpers/helpers';

// Number formater
import ReactNumberFormat from './Inputs/ReactNumberFormat';

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
	conditionOrAction: ConditionOrAction;
	inputs: Array<string | number | ethers.utils.BigNumber>;
	app: string;
	disabled: boolean;
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
		disabled
	} = props;
	// Context
	const { dispatch, icedTxState } = useIcedTxContext();

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

	// If user skipped back, pre fill with state from context

	// Generic Update User Input function
	const handleChangeNumber = (
		event: React.ChangeEvent<{ value: unknown }>
	) => {
		const newValue = event.target.value as string;

		if (newValue === '.') {
			const zero = ethers.constants.Zero;
			updateUserInput(index, zero);
		} else if (newValue !== '') {
			// Handle special case if InputType is TokenAmount
			if (inputType === InputType.TokenAmount) {
				// get index of token in question
				// @DEV Assuming that token in question always comes one index before tokenAmount
				const tokenIndex = index - 1;
				const tokenAddress = inputs[tokenIndex].toString();

				// Find token object by address
				const token = getTokenByAddress(tokenAddress);

				const weiAmount = ethers.utils.parseUnits(
					newValue.toString(),
					token.decimals
				);
				// console.log(weiAmount.toString());
				// Update global state
				console.log('updatingUserInput');
				updateUserInput(index, weiAmount);
			}
		} else if (newValue === '') {
			const zero = ethers.constants.Zero;
			updateUserInput(index, zero);
		} else {
			throw Error('Input value is empty / wrong');
			// if (inputs[index] !== 1) {
			// 	// updateUserInput(index, 1);
			// } else {
			// 	// updateUserInput(index, 10);
			// }
		}
	};

	// Func should call getValue() in smart contract and return the respective value in a disabled Text field
	// Params: Contract address | Contract Parameters
	function callGetValue() {
		// CALL Smart Contract get value
		return 999;
	}

	function callGetValueAndSetState() {
		const returnValue = callGetValue();
		updateUserInput(index, returnValue);
		return returnValue;
	}

	function deriveBool() {
		switch (app) {
			case 'Kyber':
				// If user inputted price is greater than current price, return true, otherwise false
				if (
					icedTxState.condition.userInputs[3] >
					icedTxState.condition.userInputs[5]
				) {
					updateUserInput(index, true);
				} else {
					updateUserInput(index, false);
				}
		}
	}

	// If user already inputted values, prefill inputs from state, otherwise display the default values
	// œDEV make default values specific for each condition and action, not global
	function returnDefaultValue(): string | number {
		// If user has inputted something, go in here
		if (inputs[0] !== undefined) {
			if (inputs[index] !== undefined) {
				// If the inputted value is of inputType TokenAmount
				if (inputType === InputType.TokenAmount) {
					const tokenIndex = index - 1;
					const tokenAddress = inputs[tokenIndex].toString();

					// Find token object by address
					const token = getTokenByAddress(tokenAddress);
					const humanReadableAmount = ethers.utils.formatUnits(
						inputs[index].toString(),
						token.decimals
					);

					return humanReadableAmount.toString();
				} else {
					return inputs[index].toString();
				}
			} else {
				throw Error('error, value from state is undefined');
			}
		}
		// If new render, go in here
		else {
			switch (inputType) {
				case InputType.Number:
					updateUserInput(index, 1);
					return 1;
				case InputType.TokenAmount:
					console.log('token amount else');
					const oneEthInWei = ethers.constants.WeiPerEther;
					updateUserInput(index, oneEthInWei);
					return 1;
				case InputType.Address:
					// return user address
					updateUserInput(index, '0x0');
					return '0x0';
				case InputType.Token:
					let defaultToken = TOKEN_LIST[0];
					if (index !== 0) defaultToken = TOKEN_LIST[1];
					updateUserInput(index, defaultToken.address);
					return defaultToken.address;
				default:
					return 'error';
			}
		}
	}

	function returnStringDefaultValue() {
		if (inputs[0] !== undefined || inputs[index] !== undefined) {
			return inputs[index].toString();
		}
		// If new render, go in here
		else {
			switch (inputType) {
				case InputType.Address:
					// return user address
					return '0x0';
				case InputType.Token:
					let defaultToken = TOKEN_LIST[0];
					if (index !== 0) defaultToken = TOKEN_LIST[1];
					return defaultToken.address;
				default:
					return 'error';
			}
		}
	}

	function renderInput() {
		switch (inputType) {
			case InputType.Date:
				return (
					<div className={classes.form}>
						<DateAndTimePicker
							label={label}
							index={index}
							disabled={disabled}
						></DateAndTimePicker>
					</div>
				);
			case InputType.Token:
				return (
					<div className={classes.form}>
						<TokenSelect
							defaultToken={returnStringDefaultValue()}
							index={index}
							conditionOrAction={conditionOrAction}
							label={label}
							disabled={disabled}
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
							defaultValue={returnDefaultValue()}
							convertToWei
						></ReactNumberFormat>

						{/* <TextField
							className={classes.root}
							inputProps={{ min: 1, step: 'any', lang: 'en' }}
							required
							id="outlined-full-width"
							label={label}
							style={{ marginTop: '0px', marginBottom: '0px' }}
							// Import TextField CSS
							defaultValue={returnDefaultValue()}
							// value={returnDefaultValue()}
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
			case InputType.Number:
				return (
					<div className={classes.form}>
						<ReactNumberFormat
							updateUserInput={updateUserInput}
							label={label}
							index={index}
							inputType={inputType}
							inputs={inputs}
							defaultValue={returnDefaultValue()}
							convertToWei={false}
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
							defaultValue={callGetValueAndSetState()}
							// Import TextField CSS
							// placeholder="Placeholder"
							// helperText="Full width!"
							fullWidth
							margin="normal"
							InputLabelProps={{
								shrink: true
							}}
							variant="outlined"
						/>
					</div>
				);
			case InputType.Address:
				return (
					<div className={classes.form}>
						<TextField
							className={classes.root}
							required
							id="outlined-full-width"
							label="Label"
							placeholder="Placeholder"
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
				return (
					<div className={classes.form}>
						<TextField
							required
							style={{ marginTop: '0px', marginBottom: '0px' }}
							id="outlined-full-width"
							label={label}
							defaultValue={callGetValue()}
							// Import TextField CSS
							className={classes.root}
							// placeholder="Placeholder"
							// helperText="Full width!"
							fullWidth
							margin="normal"
							InputLabelProps={{
								shrink: true
							}}
							variant="outlined"
						/>
					</div>
				);
			case InputType.Bool:
				// No render
				deriveBool();
				return <React.Fragment></React.Fragment>;
			default:
				return <div className={classes.form}></div>;
		}
	}

	return renderInput();
	// Import TextField CSS
}
