import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import {
	TriggerWhitelistData,
	ActionWhitelistData,
	TriggerOrAction
} from '../constants/interfaces';
import { useIcedTxContext } from '../state/GlobalState';
import {
	SELECT_CONDITION,
	SELECT_ACTION,
	COLOURS
} from '../constants/constants';

const useStyles = makeStyles(theme => ({
	formControl: {
		margin: theme.spacing(1),
		minWidth: 120
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
		color: 'white',
		background: COLOURS.salmon,
		'& :hover': {
			background: COLOURS.salmon50
		},
		'& .MuiSelect-icon': {
			color: 'white'
		}
	}
}));

interface AppDropdownProps {
	data: Array<TriggerWhitelistData | ActionWhitelistData>;
	triggerOrAction: number;
	app: boolean;
	updateTriggerOrAction: Function;
}

export default function AppDropdown(props: AppDropdownProps) {
	const { app, data, triggerOrAction, updateTriggerOrAction } = props;
	const { dispatch } = useIcedTxContext();
	const classes = useStyles();
	const [state, setState] = React.useState('');

	// Dispatch Reducer
	const selectTrigger = (id: string) => {
		updateTriggerOrAction(TriggerOrAction.Trigger, id);
	};
	const selectAction = (id: string) => {
		updateTriggerOrAction(TriggerOrAction.Action, id);
	};

	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		// @DEV potential BUG
		if (app) {
			setState(`${event.target.value}`);
			// IF trigger, update trigger, else update action
			triggerOrAction === TriggerOrAction.Trigger
				? selectTrigger(`${event.target.value}`)
				: selectAction(`${event.target.value}`);
		} else {
			const functionId = `${event.target.value}`;
			if (triggerOrAction === TriggerOrAction.Trigger) {
				dispatch({ type: SELECT_CONDITION, id: functionId });
			} else {
				dispatch({ type: SELECT_ACTION, id: functionId });
			}
			setState(`${functionId}`);
		}
	};

	function getApps(
		appList: Array<TriggerWhitelistData | ActionWhitelistData>
	) {
		const appTitles = appList.map(item => item.app);
		return appTitles.filter(
			(item, index) => appTitles.indexOf(item) === index
		);
	}

	return (
		<FormControl
			color="primary"
			style={{ color: 'white', marginTop: '0' }}
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
