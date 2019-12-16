import React, { useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import classes from '*.module.css';
import { InputType, ConditionOrAction } from '../constants/interfaces';
import DateAndTimePicker from './Inputs/DatePicker';
import TokenSelect from './Inputs/TokenSelect';
import { useIcedTxContext } from '../state/GlobalState';
import { TOKEN_LIST } from '../constants/constants';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			marginTop: '24px',
			// display: "flex",
			width: '100%',
			paddingRight: theme.spacing(3),
			paddingBottom: theme.spacing(2)
		},
		textField: {
			marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1)
		}
	})
);

interface InputProps {
	inputType: InputType;
	label: string;
	index: number;
	conditionOrAction: ConditionOrAction;
	inputs: Array<string | number>;
	app: string;
}

export default function LayoutTextFields(props: InputProps) {
	// Props
	const { app, inputType, label, index, conditionOrAction, inputs } = props;
	// Context
	const { updateUserInput, icedTxState } = useIcedTxContext();

	// CSS Classes
	const classes = useStyles();

	// If user skipped back, pre fill with state from context

	// Generic Update User Input function
	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		const newValue = event.target.value as number;
		// Update global state
		updateUserInput(index, newValue, conditionOrAction);
	};

	// Func should call getValue() in smart contract and return the respective value in a disabled Text field
	// Params: Contract address | Contract Parameters
	function callGetValue() {
		// CALL Smart Contract get value
		return 999;
	}

	function callGetValueAndSetState() {
		const returnValue = callGetValue();
		updateUserInput(index, returnValue, conditionOrAction);
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
					updateUserInput(index, true, conditionOrAction);
				} else {
					updateUserInput(index, false, conditionOrAction);
				}
		}
	}

	// If user already inputted values, prefill inputs from state, otherwise display the default values
	// œDEV make default values specific for each condition and action, not global
	function returnDefaultValue(): string | number {
		// If user has inputted something, go in here

		if (inputs[0] !== undefined) {
			if (inputs[index] !== undefined) {
				return inputs[index];
			} else {
				return 'error, value from state is undefined';
			}
		}
		// If new render, go in here
		else {
			switch (inputType) {
				case InputType.Number:
					return 1;
				case InputType.Address:
					// return user address
					return '0x0';
				case InputType.Token:
					let defaultToken = TOKEN_LIST[0];
					if (index !== 0) defaultToken = TOKEN_LIST[1];
					console.log(defaultToken.address);
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
					<div className={classes.root}>
						<DateAndTimePicker
							label={label}
							index={index}
						></DateAndTimePicker>
					</div>
				);
			case InputType.Token:
				return (
					<div className={classes.root}>
						<TokenSelect
							defaultToken={returnStringDefaultValue()}
							index={index}
							conditionOrAction={conditionOrAction}
							label={label}
						/>
					</div>
				);
			case InputType.Number:
				return (
					<div className={classes.root}>
						<TextField
							inputProps={{ min: 0 }}
							required
							id="outlined-full-width"
							label={label}
							style={{ marginTop: '0px', marginBottom: '0px' }}
							defaultValue={returnDefaultValue()}
							// placeholder="1"
							// helperText="Full width!"
							fullWidth
							onChange={handleChange}
							margin="normal"
							type="number"
							InputLabelProps={{
								shrink: true
							}}
							variant="outlined"
						/>
					</div>
				);
			case InputType.GetValue:
				return (
					<div className={classes.root}>
						<TextField
							required
							style={{ marginTop: '0px', marginBottom: '0px' }}
							id="outlined-full-width"
							label={label}
							defaultValue={callGetValueAndSetState()}
							disabled
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
					<div className={classes.root}>
						<TextField
							required
							id="outlined-full-width"
							label="Label"
							placeholder="Placeholder"
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
			case InputType.StatelessGetValue:
				return (
					<div className={classes.root}>
						<TextField
							required
							style={{ marginTop: '0px', marginBottom: '0px' }}
							id="outlined-full-width"
							label={label}
							defaultValue={callGetValue()}
							disabled
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
				return <div className={classes.root}></div>;
		}
	}

	return renderInput();
}
