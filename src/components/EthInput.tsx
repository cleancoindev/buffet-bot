import React from "react";
import NumberFormat from "react-number-format";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import { DEFAULT_CHAIN_ID, COLOURS } from "../constants/constants";
import { ChainIds } from "../constants/interfaces";
import { ethers, BigNumber } from "ethers";
import { convertWeiToHumanReadableForTokenAmount } from "../helpers/helpers";
import { useWeb3React } from "@web3-react/core";

import "../index.css";

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: "100%",
			"& input:valid + fieldset": {
				borderColor: COLOURS.salmon,
				borderWidth: 1,
				fontSize: "18px"
			},
			// '& input:invalid + fieldset': {
			// 	borderColor: 'red',
			// 	borderWidth: 2
			// },
			// '& input:valid:focus + fieldset': {
			// 	borderLeftWidth: 6,
			// 	padding: '4px !important', // override inline-style
			// 	borderColor: 'green'
			// },
			"& .MuiOutlinedInput-root": {
				color: "black",
				fontSize: "18px",
				// '& fieldset': {
				// 	borderColor: 'red'
				// },
				"&:hover fieldset": {
					borderColor: "black"
				}
				// '&.Mui-focused fieldset': {
				// 	borderColor: COLOURS.salmon
				// }
			},
			"& .MuiOutlinedInput-root.Mui-disabled": {
				fontSize: "18px",
				"& fieldset": {
					borderColor: "#72627b",
					borderWidth: 1
				},
				"&:hover fieldset": {
					borderColor: "#72627b"
				}
			},
			"& .MuiFormLabel-root": {
				fontSize: "18px",
				color: "black !important"
			}
		}
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
	ethNum: Function;
	userIsInvested: boolean;
	defaultValue: BigNumber;
}

export default function EthInput(props: ReactNumberFormatProps) {
	const classes = useStyles();
	const { chainId, library, account } = useWeb3React();
	const { ethNum, userIsInvested, defaultValue } = props;
	// Error Bool, default false
	// Applied to:
	// // Number

	// If the error origin is equal to the index of this input, this is the input with error
	const [displayError, setDisplayError] = React.useState(false);

	// On every render, if this input field is the one with the error, mark it as such

	// In case network Id is not defined yet, use defaul
	let networkId: ChainIds = DEFAULT_CHAIN_ID;
	if (chainId !== undefined) {
		networkId = chainId as ChainIds;
	}

	const [value, setValue] = React.useState(defaultValue);

	// We always store the WEI amount in global state, but in local state we store the userFriendly version
	const handleNewValue = (newValue: string) => {
		// Set local and global state
		let weiAmount = ethers.constants.Zero;
		if (newValue !== "" && newValue !== ".") {
			// Try Catch to detect under - and overflows in TokenAmounts
			try {
				weiAmount = ethers.utils.parseUnits(newValue, "18");
				// If we need to convert the input from userfriendly amount to WEi amount, take the converted amount, else take the original
				setValue(weiAmount);
				ethNum(weiAmount);
			} catch (error) {
				weiAmount = ethers.constants.Zero;
				setValue(weiAmount);
				ethNum(weiAmount);
			}
		} else {
			weiAmount = ethers.constants.Zero;
			setValue(weiAmount);
			ethNum(weiAmount);
		}
	};

	const handleChange = (name: keyof State) => (
		event: React.ChangeEvent<{ value: unknown }>
	) => {
		// 2. Convert human readable input to bigNumber
		const newValue = event.target.value as string;

		// Only update State when number input changed from last input!
		if (ethers.utils.parseUnits(newValue, 18) !== value) {
			handleNewValue(newValue);
		}
	};

	return (
		<TextField
			className={classes.root}
			label={`${
				userIsInvested ? "ETH amount to withdraw" : "ETH amount to invest"
			}`}
			value={convertWeiToHumanReadableForTokenAmount(value, 18)}
			onChange={handleChange("numberformat")}
			id={`formatted-numberformat-input`}
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
