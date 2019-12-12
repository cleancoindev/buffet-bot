import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import classes from "*.module.css";
import { InputType, ConditionOrAction } from "../constants/interfaces";
import DateAndTimePicker from "./Inputs/DatePicker";
import TokenSelect from "./Inputs/TokenSelect";
import { useIcedTxContext } from "../state/GlobalState";
import { DEFAULT_TOKEN_1 } from "../constants/constants";

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
    inputs: Array<string|number>;
}

export default function LayoutTextFields(props: InputProps) {
    // Props
    const { inputType, label, index, conditionOrAction, inputs } = props
    // Context
    const { updateUserInput, icedTxState } = useIcedTxContext();
    // CSS Classes
    const classes = useStyles();

    // If user skipped back, pre fill with state from context



    // Generic Update User Input function
    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newValue = event.target.value as number;
        // Update global state
        updateUserInput(index, newValue, conditionOrAction)
      };

    function returnDevaultData() {
        if (inputs[0] !== "")
        {
            console.log(inputs[0])
            return inputs[index]
        }
        else {
            console.log("in here")
            switch(inputType) {
                case(InputType.Token):
                    return DEFAULT_TOKEN_1
                case(InputType.Number):
                    return 0
                case(InputType.Address):
                    // return user address
                    return "0x0"
            }
        }

    }

    function renderInput() {

        switch(inputType) {
            case(InputType.Date):
                return (
                    <DateAndTimePicker label={label} index={index}></DateAndTimePicker>
                )
            // @DEV Add new field to whitelist & respective interface, that stores the labels of the user inputs that will be displayed on the fornt enfd
            case(InputType.Token):
                return (
                    <TokenSelect index={index} conditionOrAction={conditionOrAction} label={label}/>
                )
            case(InputType.Number):
                return (
                    <TextField
                        inputProps={{ min: 0 }}
                        required
                        id="outlined-full-width"
                        label={label}
                        style={{marginTop: '0px', marginBottom: '0px'}}
                        defaultValue = {returnDevaultData()}
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
