import React, { useState, useEffect } from 'react';
import DateFnsUtils from '@date-io/date-fns'; // choose your lib
import { ThemeProvider } from "@material-ui/styles";
import { createMuiTheme } from "@material-ui/core";


import {
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';

export default function DateAndTimePicker() {
    // @DEV TO DO:
    // SET MIN AND MAX DATE, see api https://material-ui-pickers.dev/api/DateTimePicker

  const [selectedDate, handleDateChange] = useState(new Date());

  useEffect(() => {
      convertToTimestamp()
  })

  function handleChange(date: MaterialUiPickersDate) {
    if (date !== null)
    {
        console.log(date)
        const stringDate:string = date.toString()
        const newDate = new Date(stringDate)
        console.log(newDate)
        handleDateChange(newDate)
    }

  }

  function convertToTimestamp() {
      const timestamp = Math.floor(parseInt(Date.parse(selectedDate.toString()).toString())/1000)
      console.log(timestamp)
  }

  return (
    <div style={{marginRight: '24px', marginBottom: '24px', textAlign: 'left', width: '100%'}}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker label="Input Date and Time" style={{width: '100%'}} inputVariant="outlined" showTodayButton value={selectedDate} onChange={handleChange} />
        </MuiPickersUtilsProvider>

    </div>
  );
}