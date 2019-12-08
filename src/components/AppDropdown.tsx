import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

export default function AppDropdown() {
    const classes = useStyles();
    const [state, setState] = React.useState<{ age: string | number; name: string }>({
        age: '',
        name: 'hai',
    });


    const handleChange = (name: keyof typeof state) => (
        event: React.ChangeEvent<{ value: unknown }>,
    ) => {
        setState({
        ...state,
        [name]: event.target.value,
        });
    };

    return (
        <FormControl style={{marginTop: "0"}} fullWidth variant="outlined" className={classes.formControl}>
                <Select
                    native
                    value={state.age}
                    onChange={handleChange('age')}
                    inputProps={{
                        'aria-label': 'age',
                        id: 'outlined-age-native-simple',
                    }}
                    className={classes.selectEmpty}
                >
                <option value="">Select...</option>
                <option value={10}>Calendar</option>
                <option value={20}>Wallet</option>
                <option value={30}>Kyber Network</option>
                </Select>
        </FormControl>

    )
}
