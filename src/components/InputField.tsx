import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import classes from "*.module.css";
import { InputType, ConditionOrAction } from "../constants/interfaces";
import DateAndTimePicker from "./Inputs/DatePicker";
import TokenSelect from "./Inputs/TokenSelect";
import { useIcedTxContext } from "../state/GlobalState";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
            marginTop: '24px',
            // display: "flex",
            width: '100%',
            paddingRight: theme.spacing(3),
            paddingBottom: theme.spacing(2),
		},
		textField: {
            marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1),
		}
	})
);

interface InputProps {
    inputType: InputType;
    label: string;
    index: number;
    conditionOrAction: ConditionOrAction;
}

export default function LayoutTextFields(props: InputProps) {
    // Props
    const { inputType, label, index, conditionOrAction } = props
    // Context
    const { updateUserInput, icedTxState } = useIcedTxContext();
    // CSS Classes
    const classes = useStyles();

    // Generic Update User Input function
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newValue = event.target.value as number;
        // Update global state
        updateUserInput(index, newValue, conditionOrAction)
      };


    function renderInput() {
        switch(inputType) {
            case(InputType.Date):
                return (
                    <DateAndTimePicker index={index}></DateAndTimePicker>
                )
            // @DEV Add new field to whitelist & respective interface, that stores the labels of the user inputs that will be displayed on the fornt enfd
            case(InputType.Token):
                return (
                    <TokenSelect index={index} conditionOrAction={conditionOrAction} label={label}/>
                )
            case(InputType.Number):
                return (
                    <TextField
                        required
                        id="outlined-full-width"
                        label={label}
                        style={{marginTop: '0px'}}

                        placeholder="1"
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
                )
            case(InputType.Address):
                return (
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
                )
        }

    }

	return (
		<div className={classes.root}>
            {renderInput()}
		</div>
	);
}
