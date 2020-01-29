import React, { useEffect } from 'react';
import TextField from '@material-ui/core/TextField';
import {
	InputType,
	ConditionOrAction,
	ActionWhitelistData,
	ConditionWhitelistData,
	TxState
} from '../../constants/interfaces';

import { useIcedTxContext } from '../../state/GlobalState';
import { INPUT_ERROR, INPUT_OK } from '../../constants/constants';
import { ethers } from 'ethers';

import { useWeb3React } from '@web3-react/core';

interface AddressInputProps {
	inputType: InputType;
	label: string;
	index: number;
	conditionOrAction: ConditionOrAction;
	inputs: Array<string | number | ethers.utils.BigNumber | boolean>;
	app: string;
	disabled: boolean;
	condition?: ConditionWhitelistData;
	action?: ActionWhitelistData;
	approveIndex: number;
	updateUserInput: Function;
	classes: Record<'form' | 'root', string>;
}

export default function AddressInput(props: AddressInputProps) {
	// Props
	const {
		app,
		inputType,
		label,
		index,
		conditionOrAction,
		inputs,
		disabled,
		condition,
		action,
		approveIndex,
		updateUserInput,
		classes
	} = props;
	// Context

	// Error Bool, default false
	// Applied to:
	// // Address
	const [error, setError] = React.useState(false);

	const { active, account, library } = useWeb3React();

	const { dispatch, icedTxState } = useIcedTxContext();

	// On every render, check validity
	useEffect(() => {
		console.log('Validating Address useEffect');
		// validateAddressInput(inputs[index] as string);
	}, [inputs[index]]);

	const returnDefaultString = (): string => {
		// FETCH FROM STATE
		if (inputs[0] !== undefined) {
			if (inputs[index] !== undefined) {
				return inputs[index] as string;
			}
			// Else, Use default value
			else {
				return getDefaultStringValue();
			}
		} else {
			return getDefaultStringValue();
		}
	};

	const getDefaultStringValue = () => {
		let defaultAddress: string;
		if (account) {
			defaultAddress = account;
		} else {
			defaultAddress = '0x0';
		}
		updateUserInput(index, defaultAddress);
		// validateAddressInput(defaultAddress);
		return defaultAddress;
	};

	// Used to validate address

	const handleAddressChange = (event: React.ChangeEvent<{ value: any }>) => {
		const newAddress = event.target.value as string;
		// validateAddressInput(newAddress);
		updateUserInput(index, newAddress);
	};

	// const validateAddressInput = (newAddress: string) => {
	// 	// Validate address
	// 	try {
	// 		ethers.utils.getAddress(newAddress);
	// 		if (error) {
	// 			setError(false);
	// 		}
	// 		if (
	// 			icedTxState.error.isError &&
	// 			icedTxState.error.origin === ErrorOrigin.WrongAddress
	// 		) {
	// 			console.log('Set ERROR to false Address');
	// 			dispatch({
	// 				type: INPUT_OK,
	// 				txState: TxState.displayInstallMetamask
	// 			});
	// 		}
	// 	} catch (error) {
	// 		if (!error) {
	// 			setError(true);
	// 		}
	// 		if (!icedTxState.error.isError) {
	// 			console.log('Set ERROR to true Address');
	// 			// console.log(icedTxState.txState);
	// 			dispatch({
	// 				type: INPUT_ERROR,
	// 				msg: `Input field '${label}' has to be a correct Ethereum address`,
	// 				origin: ErrorOrigin.WrongAddress,
	// 				txState: TxState.inputError
	// 			});
	// 		}
	// 	}
	// };

	return (
		<TextField
			className={classes.root}
			style={{ marginTop: '0px', marginBottom: '0px' }}
			id={`address-input-${disabled}-${conditionOrAction}-${index}`}
			label={label}
			defaultValue={returnDefaultString()}
			onChange={handleAddressChange}
			error={error}
			key={`address-input-${disabled}-${conditionOrAction}-${index}`}
			// helperText="Full width!"
			// Import TextField CSS
			margin="normal"
			InputLabelProps={{
				shrink: true
			}}
			variant="outlined"
			disabled={disabled}
		/>
	);
	// Import TextField CSS
}
