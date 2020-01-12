import React from 'react';
import NumberFormat from 'react-number-format';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { INPUT_CSS } from '../../constants/constants';
import { InputType } from '../../constants/interfaces';
import { ethers } from 'ethers';
import { getTokenByAddress } from '../../helpers/helpers';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		...INPUT_CSS
	})
);

interface NumberFormatCustomProps {
	inputRef: (instance: NumberFormat | null) => void;
	onChange: (event: { target: { value: string } }) => void;
}

function NumberFormatCustom(props: NumberFormatCustomProps) {
	const { inputRef, onChange, ...other } = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={values => {
				onChange({
					target: {
						value: values.value
					}
				});
			}}
			allowNegative={false}
			thousandSeparator
			isNumericString
			fixedDecimalScale={true}
			// prefix="$"
		/>
	);
}

interface State {
	textmask: string;
	numberformat: string;
}

interface ReactNumberFormatProps {
	label: string;
	index: number;
	updateUserInput: Function;
	inputType: InputType;
	inputs: Array<string | number | ethers.utils.BigNumber>;
	defaultValue: string | number;
	convertToWei: boolean;
	disabled: boolean;
}

export default function ReactNumberFormat(props: ReactNumberFormatProps) {
	const {
		label,
		updateUserInput,
		index,
		inputType,
		inputs,
		defaultValue,
		convertToWei,
		disabled
	} = props;
	const classes = useStyles();
	const [values, setValues] = React.useState<State>({
		textmask: '(1  )    -    ',
		numberformat: defaultValue.toString()
	});

	const handleChange = (name: keyof State) => (
		event: React.ChangeEvent<{ value: unknown }>
	) => {
		// updateUser Input
		const newValue = event.target.value as string;
		console.log(newValue);

		if (newValue !== '' && newValue !== '.') {
			setValues({
				...values,
				[name]: newValue
			});
			// Handle special case if InputType is TokenAmount
			if (inputType === InputType.TokenAmount) {
				// get index of token in question
				// @DEV Assuming that token in question always comes one index before tokenAmount
				const tokenIndex = index - 1;
				const tokenAddress = inputs[tokenIndex].toString();

				// Find token object by address
				const token = getTokenByAddress(tokenAddress);

				const weiAmount = ethers.utils.parseUnits(
					newValue.toString(),
					token.decimals
				);
				// console.log(weiAmount.toString());
				// Update global state
				console.log('updatingUserInput');
				// If we need to convert the input from userfriendly amount to WEi amount, take the converted amount, else take the original
				convertToWei
					? updateUserInput(index, weiAmount)
					: updateUserInput(index, newValue);
			} else if (inputType === InputType.Number) {
				updateUserInput(index, newValue);
			}
		} else if (newValue === '.') {
			setValues({
				...values,
				[name]: '0.'
			});
			const zero = ethers.constants.Zero;
			updateUserInput(index, zero);
		} else if (newValue === '') {
			setValues({
				...values,
				[name]: ''
			});
			const zero = ethers.constants.Zero;
			updateUserInput(index, zero);
		} else {
			throw Error('Input value is empty / wrong');
		}
	};

	return (
		<TextField
			className={classes.root}
			label={label}
			value={values.numberformat}
			onChange={handleChange('numberformat')}
			id="formatted-numberformat-input"
			InputProps={{
				inputComponent: NumberFormatCustom as any
			}}
			InputLabelProps={{
				shrink: true
			}}
			variant="outlined"
			disabled={disabled}
		/>
	);
}
