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
	SELECTED_CHAIN_ID,
	TOKEN_TRANSFER_CEILING,
	COLOURS,
	ETH
} from '../../constants/constants';
import {
	InputType,
	ConditionWhitelistData,
	ConditionOrAction,
	ChainIds,
	RelevantInputData,
	TxState,
	Token
} from '../../constants/interfaces';
import { ethers, BigNumber } from 'ethers';
import {
	getTokenByAddress,
	convertWeiToHumanReadableForNumbersAndGetValue,
	convertHumanReadableToWeiForNumbers,
	getTokenSymbol,
	userIsWhitelisted,
	findConditionById,
	convertWeiToHumanReadableForTokenAmount
} from '../../helpers/helpers';
import { useIcedTxContext } from '../../state/GlobalState';
import { useWeb3React } from '@web3-react/core';
import { TTYPES } from '../../constants/whitelist';

import '../../index.css';
import TokenSelect from './TokenSelect';

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
			// prefix={`ETH / KNC `}
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
	inputs: Array<string | number | BigNumber | boolean>;
	defaultValue: BigNumber;
	disabled: boolean;
	approveIndex: number;
	conditionOrAction: ConditionOrAction;
	relevantInputData: RelevantInputData;
}

export default function ReactNumberFormat(props: ReactNumberFormatProps) {
	const {
		label,
		updateUserInput,
		index,
		inputType,
		inputs,
		defaultValue,
		disabled,
		approveIndex,
		conditionOrAction,
		relevantInputData
	} = props;
	const classes = useStyles();
	const { chainId, library, account } = useWeb3React();
	// Error Bool, default false
	// Applied to:
	// // Number

	const { dispatch, icedTxState } = useIcedTxContext();

	// If the error origin is equal to the index of this input, this is the input with error
	const [displayError, setDisplayError] = React.useState(false);

	// On every render, if this input field is the one with the error, mark it as such
	useEffect(() => {
		if (icedTxState.error.isError && icedTxState.error.origin === index) {
			setDisplayError(true);
		}
	});

	// In case network Id is not defined yet, use default
	let networkId: ChainIds = SELECTED_CHAIN_ID;
	if (chainId !== undefined) {
		networkId = chainId as ChainIds;
	}

	// Fetch Condition or Action ID
	let id = 0;
	conditionOrAction === ConditionOrAction.Condition
		? (id = icedTxState.condition.id)
		: (id = icedTxState.action.id);

	let initialValueBigInt: BigNumber = BIG_NUM_ZERO;
	let initialValueString = '0';
	if (
		ConditionOrAction.Condition === conditionOrAction &&
		icedTxState.condition.id === 3
	) {
		initialValueBigInt = ethers.constants.WeiPerEther;
		initialValueString = '1';
	}

	// If token address is alraedy inputted, convert number using the tokens decimal field
	// @DEV Only works if we set an approve Index
	let updatedLabel = label;
	if (inputs[approveIndex] !== undefined) {
		initialValueBigInt = defaultValue;
		const tokenAddress = inputs[approveIndex] as string;
		let token = getTokenByAddress(
			tokenAddress,
			networkId,
			relevantInputData
		);

		if (inputType === InputType.TokenAmount) {
			initialValueString = ethers.utils.formatUnits(
				initialValueBigInt,
				token.decimals
			);
		} else if (inputType === InputType.Number) {
			// Convert Big NUmber fechted from the graph, to human readble using e.g. Kyher Price demimals
			initialValueString = convertWeiToHumanReadableForNumbersAndGetValue(
				initialValueBigInt,
				token,
				conditionOrAction,
				id
			);
		}
	}

	// Label Conversion Kyber Price
	// If Kyber price Condition
	if (inputs[0] !== undefined) {
		if (
			inputType === InputType.Number ||
			inputType === InputType.StatelessGetValue
		) {
			if (
				icedTxState.condition.id === 3 &&
				conditionOrAction === ConditionOrAction.Condition
			) {
				try {
					// edit label
					const sellSymbol = getTokenByAddress(
						inputs[0] as string,
						networkId,
						relevantInputData
					).symbol;

					const buySymbol = getTokenByAddress(
						inputs[2] as string,
						networkId,
						relevantInputData
					).symbol;
					updatedLabel = `${sellSymbol}/${buySymbol} ${label}`;
				} catch (error) {}
			}
		}
	}

	const [values, setValues] = React.useState<State>({
		textmask: '(1  )    -    ',
		numberformat: initialValueString
	});

	// ONLY FOR StatelessGetValue
	useEffect(() => {
		// If inputs are disabled, and we make an async request to fetch some value for getValue, run this useEffect to update the state
		// Only call function when 1) we deal with Stateless getvalue type

		if (inputs[0] !== undefined) {
			if (inputType === InputType.StatelessGetValue) {
				// handleNewValue(defaultValue.toString());

				// Find token object by address
				try {
					//@DEV MAYBE CHANGE THAT WE USE APPROVE INDEX BY DEFAULT, NOT TRUE FOR KYBER PRICE TRIGGER FOR EXAMPLE
					const tokenAddress = inputs[approveIndex] as string;

					let token = getTokenByAddress(
						tokenAddress,
						networkId,
						relevantInputData
					);

					// Find ID of condition or ACtion

					// Includes expections e.g. for Kyber Price Condition
					const humanReadableAmount = convertWeiToHumanReadableForNumbersAndGetValue(
						defaultValue,
						token,
						conditionOrAction,
						id
					);

					// Set state for all
					setValues({
						...values,
						numberformat: humanReadableAmount
					});
					dispatch({
						type: UPDATE_GET_VALUE_INPUT,
						newGetValueInput: defaultValue,
						conditionOrAction: conditionOrAction
					});
				} catch (error) {
					// console.log(error);
				}
			}
		}
	}, [defaultValue]);

	// When user selects different token, check wheather decimal number is different
	useEffect(() => {
		if (inputs[0] !== undefined) {
			if (inputType === InputType.TokenAmount) {
				try {
					const tokenAddress = inputs[approveIndex].toString();
					// Find token object by address
					let token = getTokenByAddress(
						tokenAddress,
						networkId,
						relevantInputData
					);
					const weiAmount = ethers.utils.parseUnits(
						values.numberformat,
						token.decimals
					);

					// Validate new state
					if (
						// conditionOrAction === ConditionOrAction.Action &&
						!weiAmount.eq(ethers.constants.Zero)
					)
						if (!weiAmount.eq(defaultValue)) {
							// validateLimitAmount(weiAmount, token);
							// We get here if user changed token, but the tokenAmount input remained the same, but the tokens decimals are different
							updateUserInput(index, weiAmount);
						}
				} catch (error) {
					// console.log(error);
				}
			}
		}
		// 1 to rerun validation at every new render, even if input did not change
	}, [inputs[approveIndex], 1]);
	// });

	// We always store the WEI amount in global state, but in local state we store the userFriendly version
	const handleNewValue = (newValue: string) => {
		// Set local and global state
		const defaultZero = ethers.constants.Zero;
		if (newValue !== '' && newValue !== '.') {
			const tokenAddress = inputs[approveIndex].toString();
			// Find token object by address
			let token = getTokenByAddress(
				tokenAddress,
				networkId,
				relevantInputData
			);

			let weiAmount = defaultZero;

			// Handle special case if InputType is TokenAmount
			if (inputType === InputType.TokenAmount) {
				// Try Catch to detect under - and overflows in TokenAmounts
				try {
					weiAmount = ethers.utils.parseUnits(
						newValue,
						token.decimals
					);
					// If we need to convert the input from userfriendly amount to WEi amount, take the converted amount, else take the original
					updateUserInput(index, weiAmount);
				} catch (error) {
					weiAmount = ethers.constants.MaxUint256;
					updateUserInput(index, weiAmount);
				}
			}
			// Condition: 2 => Kyber Price
			else if (inputType === InputType.Number) {
				try {
					weiAmount = convertHumanReadableToWeiForNumbers(
						newValue,
						conditionOrAction,
						id
					);

					updateUserInput(index, weiAmount);
				} catch (err) {
					weiAmount = ethers.constants.MaxUint256;
					updateUserInput(index, weiAmount);
				}
			}
			// Set state for all
			setValues({
				...values,
				numberformat: newValue
			});
			// Will be default zero if we land in the try catches, after which we should not validate

			// ######### End of big IF
		} else if (newValue === '.') {
			setValues({
				...values,
				numberformat: '0.'
			});
			updateUserInput(index, defaultZero);
		} else if (newValue === '') {
			setValues({
				...values,
				numberformat: ''
			});
			updateUserInput(index, defaultZero);
		} else {
			throw Error('Input value is empty / wrong');
		}
	};

	const handleChange = (name: keyof State) => (
		event: React.ChangeEvent<{ value: unknown }>
	) => {
		// 1. Refresh displayError if it's on
		if (displayError) {
			dispatch({
				type: INPUT_OK,
				txState: TxState.displayLogIntoMetamask
			});
			setDisplayError(false);
		}

		// 2. Convert human readable input to bigNumber
		const newValue = event.target.value as string;

		// Only update State when number input actually changed from last input!
		if (newValue !== values.numberformat) {
			handleNewValue(newValue);
		}
	};

	return (
		<TextField
			className={classes.root}
			label={updatedLabel}
			value={values.numberformat}
			onChange={handleChange('numberformat')}
			id={`formatted-numberformat-input-${conditionOrAction}-${index}`}
			InputProps={{
				inputComponent: NumberFormatCustom as any
			}}
			InputLabelProps={{
				shrink: true
			}}
			error={displayError}
			variant="outlined"
			key={`num-textfield-${conditionOrAction}-${index}`}
			disabled={disabled}
		/>
	);
}
