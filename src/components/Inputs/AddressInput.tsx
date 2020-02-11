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
import { ethers, BigNumber } from 'ethers';

import { useWeb3React } from '@web3-react/core';

interface AddressInputProps {
	inputType: InputType;
	label: string;
	index: number;
	conditionOrAction: ConditionOrAction;
	inputs: Array<string | number | BigNumber | boolean>;
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
	const { active, account, library } = useWeb3React();

	const { dispatch, icedTxState } = useIcedTxContext();

	// If the error origin is equal to the index of this input, this is the input with error
	const [displayError, setDisplayError] = React.useState(false);

	// On every render, check validity
	useEffect(() => {
		if (icedTxState.error.isError && icedTxState.error.origin === index) {
			setDisplayError(true);
		}
	});

	const returnDefaultString = (): string => {
		// FETCH FROM STATE
		if (inputs[0] !== undefined) {
			if (inputs[index] !== undefined) {
				return inputs[index] as string;
			} else {
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
		if (displayError) {
			dispatch({
				type: INPUT_OK,
				txState: TxState.displayLogIntoMetamask
			});
			setDisplayError(false);
		}
		const newAddress = event.target.value as string;
		updateUserInput(index, newAddress);
	};

	return (
		<TextField
			className={classes.root}
			style={{ marginTop: '0px', marginBottom: '0px' }}
			id={`address-input-${disabled}-${conditionOrAction}-${index}`}
			label={label}
			defaultValue={returnDefaultString()}
			onChange={handleAddressChange}
			error={displayError}
			key={`address-input-${disabled}-${conditionOrAction}-${index}`}
			margin="normal"
			InputLabelProps={{
				shrink: true
			}}
			variant="outlined"
			disabled={disabled}
		/>
	);
}
