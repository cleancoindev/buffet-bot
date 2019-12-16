import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';

import { useIcedTxContext } from '../../state/GlobalState';
import { ConditionOrAction, Token } from '../../constants/interfaces';
import { TOKEN_LIST } from '../../constants/constants';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		button: {
			display: 'block'
		},
		formControl: {
			// marginRight: '24px',
			minWidth: 120,
			width: '100%'
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
}

const findToken = (address: string) => {
	const foundToken = TOKEN_LIST.find(
		singleToken => singleToken.address === address
	);
	if (foundToken === undefined) {
		// ERROR
		return TOKEN_LIST[0];
		console.log('Failed to find Token!');
	} else {
		return foundToken;
	}
};

export default function TokenSelect(props: TokenSelectProps) {
	const { defaultToken, label, index, conditionOrAction } = props;
	const { updateUserInput, icedTxState } = useIcedTxContext();

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
		console.log('Rendering');
		updateUserInput(index, token.address, conditionOrAction);
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
		updateUserInput(index, tokenObject.address, conditionOrAction);
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
			<InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
				{label}
			</InputLabel>
			<Select
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
