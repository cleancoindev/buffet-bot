import React, { useState, useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";
import { useIcedTxContext } from "../../state/GlobalState";


import {
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { ConditionOrAction } from '../../constants/interfaces';

interface InputProps {
  // inputType: InputType;
  // label: string;
  index: number;
  label: string;
}

export default function DateAndTimePicker(props: InputProps) {
    const { index, label } = props;
    // @DEV TO DO:
    // SET MIN AND MAX DATE, see api https://material-ui-pickers.dev/api/DateTimePicker

  const { updateUserInput, icedTxState } = useIcedTxContext();
  const [selectedDate, handleDateChange] = useState(new Date());

  function handleChange(date: MaterialUiPickersDate) {
    if (date !== null)
    {

        const stringDate:string = date.toString()
        const newDate = new Date(stringDate)

        // index: number, value: number, conditionOrAction
        updateUserInput(index, convertToTimestamp(newDate), ConditionOrAction.Condition)
        handleDateChange(newDate)
    }

  }

  function convertToTimestamp(date: Date) {
      return Math.floor(parseInt(Date.parse(date.toString()).toString())/1000)

  }

  return (
    <div style={{textAlign: 'left', width: '100%'}}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker label={label} style={{width: '100%'}} inputVariant="outlined" showTodayButton value={selectedDate} onChange={handleChange} />
        </MuiPickersUtilsProvider>

    </div>
  );
}