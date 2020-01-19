import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
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
	COLOURS,
	DEFAULT_TRIGGER_ID
} from '../constants/constants';

interface AppDropdownProps {
	data: Array<TriggerWhitelistData | ActionWhitelistData>;
	triggerOrAction: number;
	app: boolean;
	// updateTriggerOrAction: Function;
}

export default function AppDropdown(props: AppDropdownProps) {
	const theme = useTheme();
	const useStyles = makeStyles({
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
	});
	const { app, data, triggerOrAction /*updateTriggerOrAction*/ } = props;
	const { dispatch, icedTxState } = useIcedTxContext();
	const classes = useStyles();
	const [state, setState] = React.useState('');

	// Dispatch Reducer
	// const selectTrigger = (id: string) => {
	// 	updateTriggerOrAction(TriggerOrAction.Trigger, id);
	// };
	// const selectAction = (id: string) => {
	// 	updateTriggerOrAction(TriggerOrAction.Action, id);
	// };

	// SET DEFAULT TRIGGER VALUE AT PAGE RENGERING
	// Only change state if: a) we render a trigger, b) the id in global state matches default trigger id and 3) if state is currently empty (select is displayed)
	useEffect(() => {
		if (
			triggerOrAction === TriggerOrAction.Trigger &&
			icedTxState.trigger.id === parseInt(DEFAULT_TRIGGER_ID) &&
			state === ''
		) {
			setState(DEFAULT_TRIGGER_ID);
		}
	}, [icedTxState.trigger.id]);

	const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
		const functionId = event.target.value as string;
		setConditionOrAction(functionId);
		//}
	};

	const setConditionOrAction = (functionId: string) => {
		if (triggerOrAction === TriggerOrAction.Trigger) {
			dispatch({ type: SELECT_CONDITION, id: functionId });
		} else {
			dispatch({ type: SELECT_ACTION, id: functionId });
		}
		setState(functionId);
	};

	function getTitles(
		appList: Array<TriggerWhitelistData | ActionWhitelistData>
	) {
		const appTitles = appList.map(item => item.title);
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
					getTitles(data).map((value, key) => (
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
