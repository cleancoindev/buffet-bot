import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import { Hash } from 'crypto';
import { WhitelistData, ConditionOrAction } from '../constants/interfaces';
import { useIcedTxContext } from '../state/GlobalState';
import { SELECT_CONDITION, SELECT_ACTION } from '../constants/constants';
import { findCondition, findAction } from '../helpers/helpers';

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	selectEmpty: {
		marginTop: theme.spacing(2)
	}
}));

interface AppDropdownProps {
	data: Array<WhitelistData>;
	conditionOrAction: number;
	app: boolean;
	updateConditionOrAction: Function;
}

export default function AppDropdown(props: AppDropdownProps) {
	const { app, data, conditionOrAction, updateConditionOrAction } = props;
	const { dispatch } = useIcedTxContext();
	const classes = useStyles();
	const [state, setState] = React.useState('');

	// Dispatch Reducer
	const selectCondition = (id: string) => {
		updateConditionOrAction(ConditionOrAction.Condition, id);
	};
	const selectAction = (id: string) => {
		updateConditionOrAction(ConditionOrAction.Action, id);
	};

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		// @DEV potential BUG
		if (app) {
			setState(`${event.target.value}`);
			// IF condition, update condition, else update action
			conditionOrAction === ConditionOrAction.Condition
				? selectCondition(`${event.target.value}`)
				: selectAction(`${event.target.value}`);
		} else {
			const functionId = `${event.target.value}`;
			if (conditionOrAction === ConditionOrAction.Condition) {
				dispatch({ type: SELECT_CONDITION, id: functionId });
			} else {
				dispatch({ type: SELECT_ACTION, id: functionId });
			}
			setState(`${functionId}`);
		}
	};

	function getApps(appList: Array<WhitelistData>) {
		const appTitles = appList.map(item => item.app);
		return appTitles.filter(
			(item, index) => appTitles.indexOf(item) === index
		);
	}

	return (
		<FormControl
			style={{ marginTop: '0' }}
			fullWidth
			variant="outlined"
			className={classes.formControl}
		>
			<Select
				native
				value={state}
				onChange={handleChange}
				inputProps={{
					'aria-label': 'age',
					id: 'outlined-age-native-simple'
				}}
				className={classes.selectEmpty}
			>
				<option value={app ? '' : 0}>Select...</option>
				{app &&
					getApps(data).map((value, key) => (
						<option key={key} value={value}>
							{value}
						</option>
					))}
				{!app &&
					data.map((value, key) => (
						<option key={key} value={value.id}>
							{value.title}
						</option>
					))}
				}
			</Select>
		</FormControl>
	);
}
