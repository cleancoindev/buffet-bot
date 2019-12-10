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

interface WhitelistData {
    id: number;
    app: string;
    title: string;
    address: string;
    inputs: Array<string>;
}

interface AppDropdownProps {
    data: Array<WhitelistData> ;
    updateTypes: Function;
    selectedMetric: number;
    userSelection: Object;
    app: boolean;
}

export default function AppDropdown(props: AppDropdownProps) {
    const classes = useStyles();
    const [state, setState] = React.useState('');
    const {app, data, updateTypes, selectedMetric, userSelection} = props

    enum Part {
        Condition,
        Action,
    }

    const handleChange = (
        event: React.ChangeEvent<{ value: unknown }>,
    ) => {
        setState(`${event.target.value}`);
        // console.log(`Name: ${selectedMetric}`)
        console.log(`Value: ${event.target.value}`)
        updateTypes(selectedMetric, event.target.value)
        // updateDataSelection
        // updateTypes({...userSelection, [selectedMetric]: event.target.value})
    };

    function getApps(appList: Array<WhitelistData>) {
        const appTitles = appList.map(item => ( item.app ))
        return appTitles.filter(( item, index ) => appTitles.indexOf(item) === index)
    }



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

                    <option value={app ? "" : 0}>Select...</option>

                    {( app &&
                        getApps(data).map((value, key) =>
                            <option key={key} value={value}>{value}</option>
                    ))}
                    {( !app &&
                        data.map((value, key) =>
                            <option key={key} value={value.id}>{value.title}</option>
                        ))}

                    }
                </Select>
        </FormControl>

    )
}
