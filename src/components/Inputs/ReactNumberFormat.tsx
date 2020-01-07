import React from 'react';
import NumberFormat from 'react-number-format';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import { INPUT_CSS } from '../../constants/constants';

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
			thousandSeparator
			isNumericString
			// prefix="$"
		/>
	);
}

interface State {
	textmask: string;
	numberformat: string;
}

export default function ReactNumberFormat() {
	const classes = useStyles();
	const [values, setValues] = React.useState<State>({
		textmask: '(1  )    -    ',
		numberformat: '1320'
	});

	const handleChange = (name: keyof State) => (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setValues({
			...values,
			[name]: event.target.value
		});
	};

	return (
		<TextField
			className={classes.root}
			label="react-number-format"
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
		/>
	);
}
