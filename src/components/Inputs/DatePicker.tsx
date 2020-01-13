import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { useIcedTxContext } from '../../state/GlobalState';

import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import {
	UPDATE_CONDITION_INPUTS,
	COLOURS,
	INPUT_CSS
} from '../../constants/constants';
import { makeStyles } from '@material-ui/core/styles';
import { createMuiTheme, TextField, FormControl } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

import { MuiPickersOverrides } from '@material-ui/pickers/typings/overrides';

type overridesNameToClassKey = {
	[P in keyof MuiPickersOverrides]: keyof MuiPickersOverrides[P];
};
declare module '@material-ui/core/styles/overrides' {
	export interface ComponentNameToClassKey extends overridesNameToClassKey {}
}

interface InputProps {
	// inputType: InputType;
	// label: string;
	index: number;
	label: string;
	disabled: boolean;
	defaultValue: string | number;
}

const materialTheme = createMuiTheme({
	overrides: {
		MuiPickersToolbar: {
			toolbar: {
				backgroundColor: COLOURS.salmon
			}
		},
		MuiTabs: {
			root: {
				background: `${COLOURS.salmon} !important`
			}
		},
		MuiPickersCalendarHeader: {
			// switchHeader: {
			// 	backgroundColor: COLOURS.salmon,
			// 	color: 'white'
			// }
		},
		MuiPickersDay: {
			day: {
				color: COLOURS.salmon
			},
			daySelected: {
				backgroundColor: COLOURS.salmon
			},
			dayDisabled: {
				color: COLOURS.salmon
			},
			current: {
				color: COLOURS.salmon
			}
		},
		MuiPickersModal: {
			dialogAction: {
				color: COLOURS.salmon
			}
		}
	}
});

// #################################################
const useInputStyles = makeStyles({
	...INPUT_CSS
});

interface TextFieldWrapProps {
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	value: Date;
	label: string;
	disabled: boolean;
}

const TextFieldWrap = (props: TextFieldWrapProps) => {
	const labelClasses = useInputStyles();
	const { setOpen, value, label, disabled } = props;

	return (
		<FormControl style={{ width: '100%' }}>
			{!disabled && (
				<TextField
					placeholder={'placeholder'}
					className={labelClasses.root}
					fullWidth
					margin="normal"
					InputLabelProps={{
						shrink: true
					}}
					variant="outlined"
					onClick={() => setOpen(true)}
					defaultValue={value}
					id="outlined-full-width"
					label={label}
					disabled={disabled}
				/>
			)}
			{disabled && (
				<TextField
					placeholder={'placeholder'}
					className={labelClasses.root}
					fullWidth
					margin="normal"
					InputLabelProps={{
						shrink: true
					}}
					variant="outlined"
					defaultValue={value}
					id="outlined-full-width"
					label={label}
					disabled={disabled}
				/>
			)}
		</FormControl>
	);
};

// #################################################

export default function DateAndTimePicker(props: InputProps) {
	const { index, label, defaultValue, disabled } = props;
	// @DEV TO DO:
	// SET MIN AND MAX DATE, see api https://material-ui-pickers.dev/api/DateTimePicker

	const { dispatch, icedTxState } = useIcedTxContext();
	// Set state with either NOW or global state
	const defaultDate = timestampToDate(defaultValue);

	const [selectedDate, handleDateChange] = useState(defaultDate);

	// @DEV DO we need that useEffect?
	React.useEffect(() => {
		console.log('Changing the condition State');
		// Set state wih default token
		dispatch({
			type: UPDATE_CONDITION_INPUTS,
			index,
			value: dateToTimestamp(selectedDate)
		});

		// updateUserInput(
		// 	index,
		// 	dateToTimestamp(selectedDate),
		// 	TriggerOrAction.Trigger
		// );
	}, []);

	function handleChange(date: MaterialUiPickersDate) {
		console.log('Handle Change');
		if (date !== null) {
			const stringDate: string = date.toString();
			const newDate = new Date(stringDate);

			// index: number, value: number, triggerOrAction
			// updateUserInput(
			// 	index,
			// 	dateToTimestamp(newDate),
			// 	TriggerOrAction.Trigger
			// );
			dispatch({
				type: UPDATE_CONDITION_INPUTS,
				index,
				value: dateToTimestamp(newDate)
			});

			handleDateChange(newDate);
		}
	}

	function timestampToDate(timestamp: number | string) {
		// We get timestamp in seconds
		const timestampInMilli = parseInt(timestamp.toString()) * 1000;
		// Convert into date object
		const dateObject = new Date(timestampInMilli);
		// We want to return Date Object
		return dateObject;
	}

	function dateToTimestamp(date: Date) {
		return Math.floor(
			parseInt(Date.parse(date.toString()).toString()) / 1000
		);
	}

	const [isOpen, setIsOpen] = useState(false);

	return (
		<div style={{ textAlign: 'left', width: '100%' }}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<ThemeProvider theme={materialTheme}>
					<DateTimePicker
						open={isOpen}
						onClose={() => setIsOpen(false)}
						label={label}
						style={{ width: '100%' }}
						inputVariant="outlined"
						showTodayButton
						value={selectedDate}
						onChange={handleChange}
						TextFieldComponent={({
							inputProps,
							onClick,
							inputRef
						}) => (
							<TextFieldWrap
								setOpen={setIsOpen}
								value={selectedDate}
								label={label}
								disabled={disabled}
								// {...props}
								// name={name}
								// input={{
								// 	value: formatDate(value, DATE_FORMAT_TIME)
								// }}
								// inputProps={inputProps}
								// onClick={onClick}
								// inputRef={inputRef}
							/>
						)}
					/>
				</ThemeProvider>
			</MuiPickersUtilsProvider>
		</div>
	);
}
