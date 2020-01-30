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
import { ethers } from 'ethers';
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
				conditionOrAction,
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
						newGetValueInput: defaultValue
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
						conditionOrAction === ConditionOrAction.Action &&
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
				txState: TxState.displayInstallMetamask
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

	// const setErrorTrue = (text: string, origin: ErrorOrigin) => {
	// 	setError(true);

	// 	// console.log('Error');
	// 	// console.log(icedTxState.txState);
	// 	dispatch({
	// 		type: INPUT_ERROR,
	// 		msg: text,
	// 		origin: origin,
	// 		txState: TxState.inputError
	// 	});
	// };

	// const setErrorFalse = (origin: ErrorOrigin) => {
	// 	// If local state is error, reset
	// 	if (error) {
	// 		setError(false);
	// 	}
	// 	if (icedTxState.error.isError && icedTxState.error.origin === origin) {
	// 		// console.log('Token Amount within limit');
	// 		dispatch({
	// 			type: INPUT_OK,
	// 			txState: TxState.displayInstallMetamask
	// 		});
	// 	}
	// };

	// @DEV we do indirect validation through default values. Value 0 is imporant e.g. when wanting balance to go to zero
	// If default value is equal to ZERO => show error

	// const validateLimitAmount = (
	// 	srcAmount: ethers.utils.BigNumber,
	// 	token: Token
	// ) => {
	// 	// IF user is whitelisted, skip
	// 	// Get Kyber Price Condition
	// 	const signer = library.getSigner();

	// 	let daiAddress = '';
	// 	if (networkId === 1) {
	// 		daiAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';
	// 	} else if (networkId === 42) {
	// 		daiAddress = '0xC4375B7De8af5a38a93548eb8453a498222C4fF2';
	// 	}

	// 	if (relevantInputData === RelevantInputData.fulcrumTokenList) {
	// 		// Instantiate pToken Contract
	// 		const pTokenAbi =
	// 			'function tokenPrice() external view returns (uint256 price)';

	// 		const pTokenContract = new ethers.Contract(
	// 			token.address[networkId] as string,
	// 			[pTokenAbi],
	// 			signer
	// 		);

	// 		// Get the price of one pToken denominated in the underylint
	// 		// Note: For short tokens, this would be DAI
	// 		// For Long Tokens, this is whatever the underyling is, e.g. dETH Long 2x == ETH
	// 		// In case of Long Token, we need to also convert the e.g. ETH value into DAI price
	// 		try {
	// 			pTokenContract
	// 				.tokenPrice()
	// 				.then(
	// 					(underlyingValuePerPtoken: ethers.utils.BigNumber) => {
	// 						// console.log(tokenPrice);
	// 						let valueToBeComparedWithDai = underlyingValuePerPtoken;
	// 						// IF token is a short sell token, price will be already in DAI denominated
	// 						const underlyingPerPtoken = convertWeiToHumanReadableForTokenAmount(
	// 							valueToBeComparedWithDai,
	// 							token.decimals
	// 						);
	// 						// console.log(underlyingPerPtoken);

	// 						if (token.name.includes('Long')) {
	// 							// console.log('Long Token');
	// 							// IF token is long token, make additional getExpectedRate call with Kyber
	// 							const condition = findConditionById('3');
	// 							const conditionContract = new ethers.Contract(
	// 								condition.address[networkId],
	// 								[condition.getConditionValueAbi],
	// 								signer
	// 							);

	// 							// @ DEV Change later when introducing more underylings
	// 							const underylingAddress = ETH.address[1];

	// 							const inputsForPrice = [
	// 								underylingAddress,
	// 								BIG_NUM_ONE,
	// 								daiAddress,
	// 								BIG_NUM_ZERO,
	// 								false
	// 							];

	// 							conditionContract
	// 								.getConditionValue(...inputsForPrice)
	// 								.then(
	// 									(
	// 										kyberPrice: ethers.utils.BigNumber
	// 									) => {
	// 										// console.log(kyberPrice);
	// 										const ethPriceInDai = convertWeiToHumanReadableForTokenAmount(
	// 											kyberPrice,
	// 											18
	// 										);
	// 										// console.log(ethPriceInDai);
	// 										const howMuchPTokenIfLongIsWorthInDay =
	// 											parseFloat(ethPriceInDai) *
	// 											parseFloat(underlyingPerPtoken);

	// 										// Multiply the amount of underyling we receive per pToken by the amount of DAI we would get for that underyling
	// 										valueToBeComparedWithDai = kyberPrice
	// 											.div(
	// 												ethers.constants.WeiPerEther
	// 											)
	// 											.mul(valueToBeComparedWithDai);

	// 										const totalDollarAmountUserWantsToTransfer = valueToBeComparedWithDai
	// 											.mul(srcAmount)
	// 											.div(
	// 												ethers.constants.WeiPerEther
	// 											);

	// 										compareUserInputToDaiMax(
	// 											totalDollarAmountUserWantsToTransfer,
	// 											valueToBeComparedWithDai,
	// 											token.address[networkId]
	// 										);
	// 									}
	// 								);
	// 						} else {
	// 							const totalDollarAmountUserWantsToTransfer = valueToBeComparedWithDai
	// 								.mul(srcAmount)
	// 								.div(ethers.constants.WeiPerEther);

	// 							compareUserInputToDaiMax(
	// 								totalDollarAmountUserWantsToTransfer,
	// 								valueToBeComparedWithDai,
	// 								token.address[networkId]
	// 							);
	// 						}

	// 						// console.log(humanReadableDollarPrice);
	// 					}
	// 				);
	// 		} catch (error) {
	// 			setDefaultAmountRestriction(token, srcAmount);
	// 			// Set default amount restriction
	// 		}
	// 	} else if (relevantInputData === RelevantInputData.kyberTokenList) {
	// 		const condition = findConditionById('3');
	// 		const conditionContract = new ethers.Contract(
	// 			condition.address[networkId],
	// 			[condition.getConditionValueAbi],
	// 			signer
	// 		);

	// 		const sellToken = token.address[networkId];
	// 		if (sellToken === daiAddress) {
	// 			const price = ethers.constants.WeiPerEther;
	// 			const totalTransferVolume = price
	// 				.mul(srcAmount)
	// 				.div(ethers.constants.WeiPerEther);

	// 			compareUserInputToDaiMax(totalTransferVolume, price, sellToken);
	// 		} else {
	// 			const inputsForPrice = [
	// 				sellToken,
	// 				BIG_NUM_ONE,
	// 				daiAddress,
	// 				BIG_NUM_ZERO,
	// 				false
	// 			];
	// 			// get value
	// 			// getConditionValue(address _src, uint256 _srcAmount, address _dest, uint256, bool)
	// 			try {
	// 				conditionContract
	// 					.getConditionValue(...inputsForPrice)
	// 					.then((kyberPrice: ethers.utils.BigNumber) => {
	// 						const totalTransferVolume = kyberPrice
	// 							.mul(srcAmount)
	// 							.div(ethers.constants.WeiPerEther);
	// 						compareUserInputToDaiMax(
	// 							totalTransferVolume,
	// 							kyberPrice,
	// 							token.address[networkId]
	// 						);

	// 						// convert Value into human readable form
	// 					});
	// 			} catch (error) {
	// 				// console.log(error);
	// 				setDefaultAmountRestriction(token, srcAmount);
	// 			}
	// 		}
	// 	}
	// };

	// const compareUserInputToDaiMax = (
	// 	valueToBeComparedWithDaiCeiling: ethers.utils.BigNumber,
	// 	exchangeRate: ethers.utils.BigNumber,
	// 	sellTokenAddress: string
	// ) => {
	// 	// If the total Transfer volume is greater than the Token Transfer Ceiling, spit out error for unwhitelisted users and no error for whitelisted users
	// 	if (TOKEN_TRANSFER_CEILING.lt(valueToBeComparedWithDaiCeiling)) {
	// 		console.log('Setting error true in dynamic Validation');
	// 		// console.log(TOKEN_TRANSFER_CEILING.toString());
	// 		// console.log('Is smaller than');
	// 		// console.log(totalTransferVolume.toString());
	// 		const ceilingBN = TOKEN_TRANSFER_CEILING.mul(
	// 			ethers.utils.bigNumberify('100000')
	// 		).div(exchangeRate);
	// 		// console.log(ceilingBN);
	// 		// console.log(ceilingBN.toString());
	// 		const ceilingFloat = parseFloat(ceilingBN.toString()) / 100000;
	// 		// .mul(ethers.utils.bigNumberify('100'))
	// 		// const ceilingFloat = (
	// 		// 	parseFloat(ceilingBN.toString()) / 100
	// 		// ).toFixed(3);
	// 		// console.log('Setting error to TRUE');
	// 		setErrorTrue(
	// 			`This alpha is restricted to move ${ceilingFloat} ${getTokenSymbol(
	// 				sellTokenAddress,
	// 				networkId,
	// 				relevantInputData
	// 			)} max. To gain a higher allowance, please contact us!`,
	// 			ErrorOrigin.DaiCeiling
	// 		);
	// 	} else {
	// 		console.log('Setting error false in dynamic Validation');
	// 		// console.log('Not in Err err');
	// 		// console.log('Ceiling');
	// 		// console.log(TOKEN_TRANSFER_CEILING.toString());
	// 		// console.log('Total Amount');
	// 		// console.log(totalTransferVolume.toString());
	// 		setErrorFalse(ErrorOrigin.DaiCeiling);
	// 	}
	// };

	// const setDefaultAmountRestriction = (
	// 	token: Token,
	// 	sellAmount: ethers.utils.BigNumber
	// ) => {
	// 	// Need to do number mambo Jambo due to big numbers not accepting decimal values
	// 	const inflationConstant = '10000000000';
	// 	const tokenMaxFloat = parseFloat(token.max);
	// 	const tokenMaxInflated = tokenMaxFloat * parseFloat(inflationConstant);

	// 	const hardcap = ethers.utils
	// 		.bigNumberify(tokenMaxInflated.toString())
	// 		.mul(ethers.constants.WeiPerEther);

	// 	const inflatedSellVolume = sellAmount.mul(
	// 		ethers.utils.bigNumberify(inflationConstant)
	// 	);
	// 	// If sell amount is greater than ceiling => ERROR
	// 	if (inflatedSellVolume.gt(hardcap)) {
	// 		console.log('Setting error true in static Validation');
	// 		// Error
	// 		setErrorTrue(
	// 			`This alpha is restricted to move ${token.max} ${getTokenSymbol(
	// 				token.address[networkId],
	// 				networkId,
	// 				relevantInputData
	// 			)} max. To gain a higher allowance, please contact us!`,
	// 			ErrorOrigin.DaiCeiling
	// 		);
	// 	} else {
	// 		console.log('Setting error false in static Validation');
	// 		// All good
	// 		setErrorFalse(ErrorOrigin.DaiCeiling);
	// 	}
	// };

	return (
		<TextField
			className={classes.root}
			label={label}
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
