import React, { useState } from 'react';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { useIcedTxContext } from '../../state/GlobalState';

import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { UPDATE_CONDITION_INPUTS } from '../../constants/constants';

interface InputProps {
	// inputType: InputType;
	// label: string;
	index: number;
	label: string;
	disabled: boolean;
}

export default function DateAndTimePicker(props: InputProps) {
	const { index, label, disabled } = props;
	// @DEV TO DO:
	// SET MIN AND MAX DATE, see api https://material-ui-pickers.dev/api/DateTimePicker

	const { dispatch, icedTxState } = useIcedTxContext();
	console.log(icedTxState);
	// Set state with either NOW or global state
	let defaultDate;
	if (icedTxState.condition.userInputs[index] === undefined) {
		defaultDate = new Date();
	} else {
		defaultDate = icedTxState.condition.userInputs[index];
		defaultDate = timestampToDate(defaultDate);
	}
	const [selectedDate, handleDateChange] = useState(defaultDate);

	React.useEffect(() => {
		// Set state wih default token
		dispatch({
			type: UPDATE_CONDITION_INPUTS,
			index,
			value: dateToTimestamp(selectedDate)
		});

		// updateUserInput(
		// 	index,
		// 	dateToTimestamp(selectedDate),
		// 	ConditionOrAction.Condition
		// );
	}, []);

	function handleChange(date: MaterialUiPickersDate) {
		console.log('Handle Change');
		if (date !== null) {
			const stringDate: string = date.toString();
			const newDate = new Date(stringDate);

			// index: number, value: number, conditionOrAction
			// updateUserInput(
			// 	index,
			// 	dateToTimestamp(newDate),
			// 	ConditionOrAction.Condition
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

	return (
		<div style={{ textAlign: 'left', width: '100%' }}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<DateTimePicker
					disabled={disabled}
					label={label}
					style={{ width: '100%' }}
					inputVariant="outlined"
					showTodayButton
					value={selectedDate}
					onChange={handleChange}
				/>
			</MuiPickersUtilsProvider>
		</div>
	);
}
