import React, { useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import {
	ConditionWhitelistData,
	ActionWhitelistData,
	ConditionOrAction
} from '../constants/interfaces';
import { useIcedTxContext } from '../state/GlobalState';
import {
	SELECT_CONDITION,
	SELECT_ACTION,
	COLOURS,
	DEFAULT_TRIGGER_ID,
	BOX,
	DEFAULT_ACTION_ID
} from '../constants/constants';
import { MenuItem } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { useWeb3React } from '@web3-react/core';

interface AppDropdownProps {
	data: Array<ConditionWhitelistData | ActionWhitelistData>;
	conditionOrAction: number;
	// updateConditionOrAction: Function;
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
			background: COLOURS.salmon60,

			'& :hover': {
				background: COLOURS.salmon50
			},
			'& .MuiSelect-icon': {
				color: 'white'
			}
		},
		dropdownText: {
			textOverflow: 'ellipsis',
			whiteSpace: 'nowrap',
			overflow: 'hidden',
			background: 'transparent !important',
			fontSize: '18px'
		}
	});
	const { data, conditionOrAction /*updateConditionOrAction*/ } = props;
	const { dispatch, icedTxState } = useIcedTxContext();
	const classes = useStyles();
	const { active } = useWeb3React();
	const [state, setState] = React.useState('0');
	// useEffect(() => {
	// 	console.log('in here');
	// 	setState('0');
	// }, []);

	// Dispatch Reducer
	// const selectCondition = (id: string) => {
	// 	updateConditionOrAction(ConditionOrAction.Condition, id);
	// };
	// const selectAction = (id: string) => {
	// 	updateConditionOrAction(ConditionOrAction.Action, id);
	// };

	// SET DEFAULT TRIGGER VALUE AT PAGE RENGERING
	// Only change state if: a) we render a condition, b) the id in global state matches default condition id and 3) if state is currently empty (select is displayed)

	useEffect(() => {
		if (
			conditionOrAction === ConditionOrAction.Condition &&
			icedTxState.condition.id !== parseInt(DEFAULT_TRIGGER_ID) &&
			state === '0'
		) {
			setState(icedTxState.condition.id.toString());
		} else if (
			conditionOrAction === ConditionOrAction.Action &&
			icedTxState.action.id !== parseInt(DEFAULT_ACTION_ID) &&
			state === '0'
		) {
			setState(icedTxState.action.id.toString());
			// IF we refresh both action and condition global state to 0, also change local state to 0
		} else if (
			icedTxState.action.id === parseInt('0') &&
			icedTxState.condition.id === parseInt('0') &&
			state !== '0'
		) {
			setState('0');
		}
	}, [active]);

	useEffect(() => {
		if (
			conditionOrAction === ConditionOrAction.Condition &&
			icedTxState.condition.id === parseInt(DEFAULT_TRIGGER_ID) &&
			state === '0'
		) {
			setState(DEFAULT_TRIGGER_ID);
		}
	}, [icedTxState.condition.id]);

	useEffect(() => {
		if (
			conditionOrAction === ConditionOrAction.Action &&
			icedTxState.action.id === parseInt(DEFAULT_ACTION_ID) &&
			state === '0'
		) {
			setState(DEFAULT_ACTION_ID);
		}
	}, [icedTxState.action.id]);

	const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
		const functionId = event.target.value as string;
		setConditionOrAction(functionId);
		//}
	};

	const setConditionOrAction = (functionId: string) => {
		if (conditionOrAction === ConditionOrAction.Condition) {
			dispatch({ type: SELECT_CONDITION, id: functionId });
		} else {
			dispatch({ type: SELECT_ACTION, id: functionId });
		}
		setState(functionId);
	};

	const [open, setOpen] = React.useState(false);

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	return (
		<FormControl
			color="primary"
			style={{ color: 'white', marginTop: '0' }}
			fullWidth
			variant="outlined"
			className={classes.formControl}
		>
			<Select
				// native
				value={state}
				onChange={handleChange}
				inputProps={{
					'aria-label': 'age',
					id: 'outlined-age-native-simple'
				}}
				className={classes.selectEmpty}
				// Tests
				open={open}
				onClose={handleClose}
				onOpen={handleOpen}

				// value={conditionOrAction === ConditionOrAction.Condition ? icedTxState.condition.id : icedTxState.action.id}
			>
				<MenuItem key={0} value={'0'} style={{ overflowX: 'auto' }}>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'row',
							background: 'transparent'
						}}
					>
						<SearchIcon
							fontSize={'default'}
							style={{
								marginRight: '8px',
								background: 'transparent'
							}}
							// src={'/images/gelato_logo.png'}
							// alt="Kaka"
						></SearchIcon>
						<p className={classes.dropdownText}>Select...</p>
					</div>
				</MenuItem>

				{data.map((value, key) => (
					<MenuItem
						key={key}
						value={value.id}
						style={{ overflowX: 'auto' }}
					>
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								flexDirection: 'row',
								background: 'transparent'
							}}
						>
							<img
								style={{
									maxHeight: '45px',
									width: '25px',
									marginRight: '8px',
									background: 'transparent'
								}}
								src={value.logo}
								alt=""
							></img>
							<p className={classes.dropdownText}>
								{value.title}
							</p>
						</div>
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}

{
	/* <option value={0}>Select...</option>

				{data.map((value, key) => (
					<option key={key} value={value.id}>
						{value.title}
					</option>
				))} */
}
