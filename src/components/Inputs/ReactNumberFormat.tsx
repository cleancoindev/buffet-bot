import React, { useEffect } from 'react';
import NumberFormat from 'react-number-format';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import {
	INPUT_CSS,
	UPDATE_GET_VALUE_INPUT,
	BIG_NUM_ZERO,
	BIG_NUM_ONE,
	INPUT_ERROR,
	INPUT_OK,
	SELECTED_CHAIN_ID
} from '../../constants/constants';
import {
	InputType,
	TriggerWhitelistData,
	TriggerOrAction,
	ChainIds
} from '../../constants/interfaces';
import { ethers } from 'ethers';
import {
	getTokenByAddress,
	convertWeiToHumanReadable
} from '../../helpers/helpers';
import { useIcedTxContext } from '../../state/GlobalState';
import { useWeb3React } from '@web3-react/core';

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
	inputs: Array<string | number | ethers.utils.BigNumber | boolean>;
	defaultValue: ethers.utils.BigNumber;
	convertToWei: boolean;
	disabled: boolean;
	tokenIndex: number;
	triggerOrAction: TriggerOrAction;
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
		disabled,
		tokenIndex,
		triggerOrAction
	} = props;
	const classes = useStyles();
	const { chainId, active } = useWeb3React();

	// In case network Id is not defined yet, use default
	let networkId: ChainIds = SELECTED_CHAIN_ID;
	if (chainId !== undefined) {
		networkId = chainId as ChainIds;
	}

	// Convert defaultValue into human readable version

	// @DEV Check if that works with eth

	// const humanFriendlyAmount = ethers.utils.formatUnits(
	// 	defaultValue,
	// 	token.decimals
	// );
	let initialValueBigInt: ethers.utils.BigNumber = BIG_NUM_ZERO;
	let initialValueString = '0';
	if (inputType === InputType.Number || inputType === InputType.TokenAmount) {
		initialValueBigInt = BIG_NUM_ONE;
		initialValueString = '1';
	}

	const [values, setValues] = React.useState<State>({
		textmask: '(1  )    -    ',
		numberformat: defaultValue.eq(initialValueBigInt)
			? initialValueString
			: convertWeiToHumanReadable(
					defaultValue,
					getTokenByAddress(inputs[tokenIndex].toString(), networkId)
			  )
	});

	// Error Bool, default false
	// Applied to:
	// // Number
	const [error, setError] = React.useState(false);

	const { dispatch, icedTxState } = useIcedTxContext();

	// ONLY FOR StatelessGetValue
	useEffect(() => {
		// If inputs are disabled, and we make an async request to fetch some value for getValue, run this useEffect to update the state
		// Only call function when 1) we deal with Stateless getvalue type

		if (inputs[0] !== undefined) {
			if (inputType === InputType.StatelessGetValue) {
				// handleNewValue(defaultValue.toString());

				// Find token object by address
				try {
					const tokenAddress = inputs[tokenIndex] as string;

					let token = getTokenByAddress(tokenAddress, networkId);
					const humanReadableAmount = convertWeiToHumanReadable(
						defaultValue,
						token
					);

					// Set state for all
					setValues({
						...values,
						numberformat: humanReadableAmount
					});
					dispatch({
						type: UPDATE_GET_VALUE_INPUT,
						newGetValueInput: defaultValue
					});
				} catch (error) {
					console.log(error);
				}
			}
		}
	}, [defaultValue]);

	// We always store the WEI amount in global state, but in local state we store the userFriendly version
	const handleNewValue = (newValue: string) => {
		// Validate defaultValue
		// We need value 0
		// validateUserInput();

		// Set local and global state
		if (newValue !== '' && newValue !== '.') {
			// setValues({
			// 	...values,
			// 	numberformat: newValue
			// });
			const tokenAddress = inputs[tokenIndex].toString();
			// Find token object by address
			let token = getTokenByAddress(tokenAddress, chainId as ChainIds);

			// Handle special case if InputType is TokenAmount
			if (inputType === InputType.TokenAmount) {
				// get index of token in question
				// @DEV Assuming that token in question always comes one index before tokenAmount
				// @DEV change to approval amount

				const weiAmount = ethers.utils.parseUnits(
					newValue,
					token.decimals
				);
				// console.log(weiAmount.toString());
				// Update global state
				// If we need to convert the input from userfriendly amount to WEi amount, take the converted amount, else take the original
				convertToWei
					? updateUserInput(index, weiAmount)
					: updateUserInput(index, newValue);
			} else if (inputType === InputType.Number) {
				updateUserInput(index, newValue);
			}
			// Set state for all
			setValues({
				...values,
				numberformat: newValue
			});

			// ######### End of big IF
		} else if (newValue === '.') {
			setValues({
				...values,
				numberformat: '0.'
			});
			const zero = ethers.constants.Zero;

			updateUserInput(index, zero);
		} else if (newValue === '') {
			setValues({
				...values,
				numberformat: ''
			});
			const zero = ethers.constants.Zero;

			updateUserInput(index, zero);
		} else {
			throw Error('Input value is empty / wrong');
		}
	};

	const handleChange = (name: keyof State) => (
		event: React.ChangeEvent<{ value: unknown }>
	) => {
		// updateUser Input
		const newValue = event.target.value as string;
		handleNewValue(newValue);
	};

	// @DEV we do indirect validation through default values. Value 0 is imporant e.g. when wanting balance to go to zero
	// If default value is equal to ZERO => show error
	/*
	const validateUserInput = () => {
		console.log('validating');
		// Dont do for statelessGetValue
		if (inputType !== InputType.StatelessGetValue) {
			// If default value is equal to ZERO => Set error
			if (defaultValue.eq(BIG_NUM_ZERO)) {
				console.log(' Error');
				setError(true);
				if (!icedTxState.error.isError) {
					console.log('set Error');
					dispatch({
						type: INPUT_ERROR,
						msg: `Input for '${label}' can't be 0`
					});
				}
			}
			// IF input is greater than zero => Set Input = OK
			else {
				setError(false);
				console.log('no error');
				if (icedTxState.error.isError) {
					console.log('set NO Error');
					dispatch({
						type: INPUT_OK
					});
				}
			}
		}
	};
	*/

	return (
		<TextField
			className={classes.root}
			label={label}
			value={values.numberformat}
			onChange={handleChange('numberformat')}
			id={`formatted-numberformat-input-${triggerOrAction}-${index}`}
			InputProps={{
				inputComponent: NumberFormatCustom as any
			}}
			InputLabelProps={{
				shrink: true
			}}
			error={error}
			variant="outlined"
			key={`num-textfield-${triggerOrAction}-${index}`}
			disabled={disabled}
		/>
	);
}
