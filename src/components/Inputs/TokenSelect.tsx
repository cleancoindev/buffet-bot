import React from 'react';
import {
	makeStyles,
	Theme,
	createStyles,
	withStyles
} from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import { useIcedTxContext } from '../../state/GlobalState';
import { ConditionOrAction, Token } from '../../constants/interfaces';
import {
	TOKEN_LIST,
	UPDATE_CONDITION_INPUTS,
	UPDATE_ACTION_INPUTS,
	INPUT_CSS,
	COLOURS
} from '../../constants/constants';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			display: 'block'
		},
		formControl: {
			// marginRight: '24px',
			width: '100%',
			'& .MuiOutlinedInput-root:hover': {
				'& fieldset': {
					borderColor: 'white'
				}
			},
			'& .MuiOutlinedInput-root.Mui-disabled': {
				'& fieldset': {
					borderColor: COLOURS.salmon,
					borderWidth: 2
				}
			}
		},
		select: {
			'& fieldset': {
				borderColor: COLOURS.salmon,
				borderWidth: 2,
				color: 'white',
				'& .MuiOutlinedInput:hover': {
					borderColor: 'white'
				}
			},
			'& .MuiSelect-root': {
				color: 'white'
			},
			'& .MuiOutlinedInput-notchedOutline': {
				'&:hover': {
					borderColor: 'white'
				}
			}
		}
	})
);

interface TokenSelectProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
	label: string;
	index: number;
	conditionOrAction: ConditionOrAction;
	// @DEV CHANGE later when implented better DEFAULT VALUE system, this should only be string
	defaultToken: string;
	disabled: boolean;
}

const findToken = (address: string) => {
	const foundToken = TOKEN_LIST.find(
		singleToken => singleToken.address === address
	);
	if (foundToken === undefined) {
		// ERROR
		console.log('Failed to find Token!');
		return TOKEN_LIST[0];
	} else {
		return foundToken;
	}
};

export default function TokenSelect(props: TokenSelectProps) {
	const { defaultToken, label, index, conditionOrAction, disabled } = props;
	const { dispatch } = useIcedTxContext();

	// updateUser Input
	const updateConditionInputs = (index: number, value: any) => {
		// Default Index => @DEV Restructure Dispatcher later
		dispatch({ type: UPDATE_CONDITION_INPUTS, index, value });
	};

	const updateActionInputs = (index: number, value: any) => {
		// Default Index => @DEV Restructure Dispatcher later
		dispatch({ type: UPDATE_ACTION_INPUTS, index, value });
	};

	// Based on whether the input is a condition or action, select a different dispatch function
	let updateUserInput: Function;
	updateUserInput =
		conditionOrAction === ConditionOrAction.Condition
			? updateConditionInputs
			: updateActionInputs;

	const classes = useStyles();
	// @DEV Add a condition that always two different tokens will be shown by default

	// Pref
	const [token, setToken] = React.useState<Token>(findToken(defaultToken));
	// console.log(token)
	// console.log(icedTxState)
	// console.log(conditionOrAction)

	const [open, setOpen] = React.useState(false);

	const inputLabel = React.useRef<HTMLLabelElement>(null);

	const [labelWidth, setLabelWidth] = React.useState(0);
	React.useEffect(() => {
		setLabelWidth(inputLabel.current!.offsetWidth);
		// Set state wih default token
		updateUserInput(index, token.address);
	}, []);

	const handleChange = (event: React.ChangeEvent<{ value: any }>) => {
		const tokenAddress = event.target.value as string;
		const tokenObject = findToken(tokenAddress);
		if (tokenObject === undefined) {
			console.log('ERROR in fetching Token');
			return 'ERROR in finding Token';
		}
		// Update local state
		setToken(tokenObject);
		// Update global state
		updateUserInput(index, tokenObject.address);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const handleOpen = () => {
		setOpen(true);
	};

	/* <Button className={classes.button} onClick={handleOpen}>
        Open the select
      </Button> */

	return (
		<FormControl variant="outlined" className={classes.formControl}>
			<InputLabel
				style={{ color: 'white' }}
				ref={inputLabel}
				id="demo-simple-select-outlined-label"
			>
				{label}
			</InputLabel>
			<Select
				className={classes.select}
				style={{ textAlign: 'left' }}
				required
				labelId="demo-simple-select-outlined-label"
				id="demo-simple-select-outlined-label"
				open={open}
				onClose={handleClose}
				onOpen={handleOpen}
				value={token.address}
				onChange={handleChange}
				labelWidth={labelWidth}
				disabled={disabled}
				// input={<SalmonSelect />}
			>
				{TOKEN_LIST.map((possibleToken, key) => (
					<MenuItem key={key} value={possibleToken.address}>
						{possibleToken.symbol}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}
