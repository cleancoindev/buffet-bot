import React, { useEffect } from 'react';
import { ethers } from 'ethers';
import {
	TriggerOrAction,
	ChainIds,
	TriggerWhitelistData,
	ActionWhitelistData,
	Token,
	InputType,
	RelevantInputData
} from '../../constants/interfaces';
import { useStyles } from '@material-ui/pickers/views/Calendar/SlideTransition';
import { useWeb3React } from '@web3-react/core';
import {
	SELECTED_CHAIN_ID,
	BIG_NUM_ZERO,
	ACTION_GET_VALUE_ABI
} from '../../constants/constants';
import ReactNumberFormat from './ReactNumberFormat';
import { useIcedTxContext } from '../../state/GlobalState';
import { getTokenByAddress, encodeActionPayload } from '../../helpers/helpers';

interface ReactNumberFormatProps {
	label: string;
	index: number;
	updateUserInput: Function;
	inputType: InputType;
	inputs: Array<string | number | ethers.utils.BigNumber | boolean>;
	disabled: boolean;
	approveIndex: number;
	triggerOrAction: TriggerOrAction;
	trigger?: TriggerWhitelistData;
	action?: ActionWhitelistData;
	relevantInputData: RelevantInputData;
}

const StatelessGetValueInput = (props: ReactNumberFormatProps) => {
	const {
		label,
		updateUserInput,
		index,
		inputType,
		inputs,
		disabled,
		approveIndex,
		triggerOrAction,
		trigger,
		action,
		relevantInputData
	} = props;
	// console.log(inputs);

	// const classes = useStyles();
	const { chainId, active } = useWeb3React();

	// In case network Id is not defined yet, use default
	let networkId: ChainIds = SELECTED_CHAIN_ID;
	if (chainId !== undefined) {
		networkId = chainId as ChainIds;
	}

	const { account, library } = useWeb3React();
	const { icedTxState } = useIcedTxContext();

	const [getValueState, setGetValueState] = React.useState(
		icedTxState.trigger.getTriggerValueInput
	);
	// If globalState changes, call once
	useEffect(() => {
		if (!disabled && inputs[0] !== undefined) {
			callGetValueAndSetState();
		}
	}, [icedTxState]);

	// Func should call getValue() in smart contract and return the respective value in a disabled Text field
	// Params: Contract address | Contract Parameters
	const callGetValue = async () => {
		// Get abi
		let newValue = icedTxState.trigger.getTriggerValueInput;
		// WHen on summary page, return global state

		if (disabled) return newValue;

		if (active && account) {
			let abi = '';
			triggerOrAction === TriggerOrAction.Trigger
				? (abi = icedTxState.trigger.getTriggerValueAbi)
				: (abi = icedTxState.action.getActionValueAbi);

			try {
				// Find token object by address
				const signer = library.getSigner();

				if (triggerOrAction === TriggerOrAction.Trigger) {
					const triggerAddress =
						icedTxState.trigger.address[networkId];
					const triggerContract = new ethers.Contract(
						triggerAddress,
						[abi],
						signer
					);

					// get value
					try {
						newValue = await triggerContract.getTriggerValue(
							...inputs
						);
						console.log(inputs);
						console.log(newValue.toString());
						// Convert fetched wei amount to human reable amount

						// convert Value into human readable form
						return newValue;
					} catch (error) {
						console.log(error);
						newValue = BIG_NUM_ZERO;
						// console.log(2);
						return newValue;
					}
				}
				// IF it is an action
				else {
					const actionAddress = icedTxState.action.address[networkId];
					const actionContract = new ethers.Contract(
						actionAddress,
						[abi],
						signer
					);

					try {
						const copyUserInput = [...inputs];
						copyUserInput.splice(0, 0, account);
						// œDEV simply using account here, as proxy doesnt make a difference
						copyUserInput.splice(1, 0, account);
						newValue = await actionContract.getUsersSourceTokenBalance(
							...copyUserInput
						);
						// Convert fetched wei amount to human reable amount

						// convert Value into human readable form
						return newValue;
					} catch (error) {
						console.log(error);
						newValue = BIG_NUM_ZERO;
						// console.log(2);
						return newValue;
					}
				}
				//Instantiate contract

				// try {
				// 	newValue = await library.getBalance(account);
				// 	// convert Value into human readable form
				// 	return newValue;
				// } catch (error) {
				// 	newValue = BIG_NUM_ZERO;
				// 	// console.log(1);
				// 	return newValue;
				// }
			} catch (error) {
				// console.log('token not in state yet');
				console.log(error);
				newValue = BIG_NUM_ZERO;
				// console.log(3);
				return newValue;
			}
		} else {
			console.log('catch2');
			newValue = BIG_NUM_ZERO;
			// console.log(4);
			return newValue;
		}
	};

	async function callGetValueAndSetState() {
		// Only at first render set state, otherwise infinite loop
		const returnValue = await callGetValue();
		// updateUserInput(index, returnValue);
		// Only set state if the return value is different
		if (!returnValue.eq(getValueState)) {
			// console.log('setting local state');
			setGetValueState(returnValue);
		}
	}

	if (!disabled) {
		return (
			<ReactNumberFormat
				updateUserInput={updateUserInput}
				label={label}
				index={index}
				inputType={inputType}
				inputs={inputs}
				defaultValue={getValueState}
				disabled={true}
				approveIndex={approveIndex}
				triggerOrAction={triggerOrAction}
				relevantInputData={relevantInputData}
				key={`getValue-input-${disabled}-${triggerOrAction}-${index}`}
			></ReactNumberFormat>
		);
	} else {
		return <React.Fragment></React.Fragment>;
	}
};

export default StatelessGetValueInput;
