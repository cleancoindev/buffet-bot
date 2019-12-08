import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import { Hash } from 'crypto';

const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

interface AppDropdownProps {
    data: Array<string>;
    setUserSelection: Function;
    selectedMetric: string;
    userSelection: Object;
}

export default function AppDropdown(props: AppDropdownProps) {
    const classes = useStyles();
    const [state, setState] = React.useState('');
    const data = props.data
    const setUserSelection = props.setUserSelection
    const selectedMetric = props.selectedMetric
    const userSelection = props.userSelection

    const handleChange = (
        event: React.ChangeEvent<{ value: unknown }>,
    ) => {
        setState(`${event.target.value}`);
        // console.log(`Name: ${selectedMetric}`)
        // console.log(`Value: ${event.target.value}`)
        setUserSelection({...userSelection, [selectedMetric]: event.target.value})
    };

    return (
        <FormControl style={{marginTop: "0"}} fullWidth variant="outlined" className={classes.formControl}>
                <Select
                    native
                    value={state}
                    onChange={handleChange}
                    inputProps={{
                        'aria-label': 'age',
                        id: 'outlined-age-native-simple',
                    }}
                    className={classes.selectEmpty}
                >
                    <option value="">Select...</option>
                    {data.map((value, key) =>
                        <option key={key} value={value}>{value}</option>
                    )}
                </Select>
        </FormControl>

    )
}
