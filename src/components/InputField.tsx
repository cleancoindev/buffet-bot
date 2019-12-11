import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import classes from "*.module.css";
import { InputType } from "../constants/interfaces";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
            marginTop: '24px',
            display: "flex",
            width: '100%'
		},
		textField: {
            marginLeft: theme.spacing(1),
			marginRight: theme.spacing(1),
		}
	})
);

interface InputProps {
    inputType: InputType;
}

export default function LayoutTextFields(props: InputProps) {
    const { inputType } = props
    const classes = useStyles();


    function renderInput() {
        console.log(inputType)
        switch(inputType) {
            case(InputType.Date):
                return (
                    <TextField
                        id="outlined-full-width"
                        label="Label"
                        style={{ marginTop: 8, marginRight: 16 }}
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
