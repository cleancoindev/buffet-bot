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
	COLOURS
} from '../../constants/constants';
import {
	InputType,
	TriggerWhitelistData,
	TriggerOrAction,
	ChainIds,
	RelevantInputData,
	TxState
} from '../../constants/interfaces';
import { ethers } from 'ethers';
import {
	getTokenByAddress,
	convertWeiToHumanReadableForNumbersAndGetValue,
	convertHumanReadableToWeiForNumbers,
	getTokenSymbol,
	userIsWhitelisted
} from '../../helpers/helpers';
import { useIcedTxContext } from '../../state/GlobalState';
import { useWeb3React } from '@web3-react/core';
import { TTYPES } from '../../constants/whitelist';

import '../../index.css';

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
	disabled: boolean;
	approveIndex: number;
	triggerOrAction: TriggerOrAction;
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
		triggerOrAction,
		relevantInputData
	} = props;
	const classes = useStyles();
	const { chainId, library, account } = useWeb3React();
	// Error Bool, default false
	// Applied to:
	// // Number
	let whitelisted = false;
	if (account !== undefined) {
		whitelisted = userIsWhitelisted(account as string);
	}
	const [error, setError] = React.useState(false);

	const { dispatch, icedTxState } = useIcedTxContext();

	// In case network Id is not defined yet, use default
	let networkId: ChainIds = SELECTED_CHAIN_ID;
	if (chainId !== undefined) {
		networkId = chainId as ChainIds;
	}

	// Fetch Trigger or Action ID
	let id = 0;
	triggerOrAction === TriggerOrAction.Trigger
		? (id = icedTxState.trigger.id)
		: (id = icedTxState.action.id);

	// Convert defaultValue into human readable version

	// @DEV Check if that works with eth

	// const humanFriendlyAmount = ethers.utils.formatUnits(
	// 	defaultValue,
	// 	token.decimals
	// );

	let initialValueBigInt: ethers.utils.BigNumber = BIG_NUM_ZERO;
	let initialValueString = '0';
	// If token address is alraedy inputted, convert number using the tokens decimal field
	// @DEV Only works if we set an approve Index
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
				triggerOrAction,
				id
			);
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

					// Find ID of trigger or ACtion

					// Includes expections e.g. for Kyber Price Trigger
					const humanReadableAmount = convertWeiToHumanReadableForNumbersAndGetValue(
						defaultValue,
						token,
						triggerOrAction,
						id
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
					// We get here if user changed token, but the tokenAmount input remained the same, but the tokens decimals are different
					if (!weiAmount.eq(defaultValue)) {
						updateUserInput(index, weiAmount);
					}
				} catch (error) {
					console.log(error);
				}
			}
		}
	}, [inputs[approveIndex]]);

	// We always store the WEI amount in global state, but in local state we store the userFriendly version
	const handleNewValue = (newValue: string) => {
		// Set local and global state
		if (newValue !== '' && newValue !== '.') {
			// setValues({
			// 	...values,
			// 	numberformat: newValue
			// });
			// NO need for getValue index beaucse it doesnt change manually
			const tokenAddress = inputs[approveIndex].toString();
			// Find token object by address
			let token = getTokenByAddress(
				tokenAddress,
				networkId,
				relevantInputData
			);

			// Handle special case if InputType is TokenAmount
			if (inputType === InputType.TokenAmount) {
				// get index of token in question

				// Try Catch to detect under - and overflows in TokenAmounts
				try {
					const weiAmount = ethers.utils.parseUnits(
						newValue,
						token.decimals
					);

					setErrorFalse();

					// If we need to convert the input from userfriendly amount to WEi amount, take the converted amount, else take the original
					updateUserInput(index, weiAmount);
				} catch (error) {
					setErrorTrue(
						`Input field '${label}' can only have ${token.decimals} decimals`
					);
				}
			}
			// Trigger: 2 => Kyber Price
			else if (inputType === InputType.Number) {
				try {
					const weiAmount = convertHumanReadableToWeiForNumbers(
						newValue,
						triggerOrAction,
						id
					);

					// If local state is error, reset
					setErrorFalse();
					updateUserInput(index, weiAmount);
				} catch (err) {
					setErrorTrue(
						`Input field '${label}' can only have ${token.decimals} decimals`
					);
				}
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

		// Only update State when number input actually changed from last input!
		if (newValue !== values.numberformat) {
			handleNewValue(newValue);
			if (
				inputType === InputType.TokenAmount &&
				triggerOrAction === TriggerOrAction.Action &&
				!whitelisted
			) {
				try {
					validateLimitAmount(ethers.utils.parseUnits(newValue, 18));
				} catch (error) {
					console.log('bug');
				}
			}
		}
	};

	const setErrorTrue = (text: string) => {
		setError(true);

		// console.log('Error');
		// console.log(icedTxState.txState);
		dispatch({
			type: INPUT_ERROR,
			msg: text,
			txState: TxState.inputError
		});
	};

	const setErrorFalse = () => {
		// If local state is error, reset
		if (error) {
			setError(false);
		}
		if (icedTxState.error.isError) {
			// console.log('Token Amount within limit');
			dispatch({
				type: INPUT_OK,
				txState: TxState.displayInstallMetamask
			});
		}
	};

	// @DEV we do indirect validation through default values. Value 0 is imporant e.g. when wanting balance to go to zero
	// If default value is equal to ZERO => show error

	const validateLimitAmount = (srcAmount: ethers.utils.BigNumber) => {
		// IF user is whitelisted, skip
		// Get Kyber Price Trigger
		const signer = library.getSigner();

		const triggerContract = new ethers.Contract(
			TTYPES[1].address[networkId],
			[TTYPES[1].getTriggerValueAbi],
			signer
		);

		const sellToken = inputs[approveIndex] as string;
		const daiAddress = '0xC4375B7De8af5a38a93548eb8453a498222C4fF2';
		const inputsForPrice = [
			sellToken,
			BIG_NUM_ONE,
			daiAddress,
			BIG_NUM_ZERO,
			false
		];
		// get value

		try {
			triggerContract
				.getTriggerValue(...inputsForPrice)
				.then((kyberPrice: ethers.utils.BigNumber) => {
					const totalTransferVolume = kyberPrice
						.mul(srcAmount)
						.div(ethers.constants.WeiPerEther);

					// If the total Transfer volume is greater than the Token Transfer Ceiling, spit out error for unwhitelisted users and no error for whitelisted users
					if (TOKEN_TRANSFER_CEILING.lt(totalTransferVolume)) {
						// console.log('in err');
						// console.log(TOKEN_TRANSFER_CEILING.toString());
						// console.log('Is smaller than');
						// console.log(totalTransferVolume.toString());
						const ceilingBN = TOKEN_TRANSFER_CEILING.mul(
							ethers.utils.bigNumberify('100')
						).div(kyberPrice);
						// console.log(ceilingBN);
						// console.log(ceilingBN.toString());
						const ceilingFloat =
							parseFloat(ceilingBN.toString()) / 100;
						// .mul(ethers.utils.bigNumberify('100'))
						// const ceilingFloat = (
						// 	parseFloat(ceilingBN.toString()) / 100
						// ).toFixed(3);
						setErrorTrue(
							`This alpha is restricted to move ${ceilingFloat} ${getTokenSymbol(
								sellToken,
								networkId,
								relevantInputData
							)} max. To gain a higher allowance, please contact us!`
						);
					} else {
						// console.log('Not in Err err');
						// console.log('Ceiling');
						// console.log(TOKEN_TRANSFER_CEILING.toString());
						// console.log('Total Amount');
						// console.log(totalTransferVolume.toString());
						setErrorFalse();
					}
					// convert Value into human readable form
				});
		} catch (error) {
			// console.log('Did not fetch price');
		}
	};

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
