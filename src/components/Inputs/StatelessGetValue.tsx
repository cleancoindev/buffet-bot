import React, { useEffect } from 'react';
import { ethers, BigNumber } from 'ethers';
import {
	ConditionOrAction,
	ChainIds,
	ConditionWhitelistData,
	ActionWhitelistData,
	Token,
	InputType,
	RelevantInputData
} from '../../constants/interfaces';
import { useStyles } from '@material-ui/pickers/views/Calendar/SlideTransition';
import { useWeb3React } from '@web3-react/core';
import { DEFAULT_CHAIN_ID, BIG_NUM_ZERO } from '../../constants/constants';
import ReactNumberFormat from './ReactNumberFormat';
import { useIcedTxContext } from '../../state/GlobalState';
import { getTokenByAddress, encodeActionPayload } from '../../helpers/helpers';

interface ReactNumberFormatProps {
	label: string;
	index: number;
	updateUserInput: Function;
	inputType: InputType;
	inputs: Array<string | number | BigNumber | boolean>;
	disabled: boolean;
	approveIndex: number;
	conditionOrAction: ConditionOrAction;
	condition?: ConditionWhitelistData;
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
		conditionOrAction,
		condition,
		action,
		relevantInputData
	} = props;
	// console.log(inputs);

	// const classes = useStyles();
	const { chainId, active } = useWeb3React();

	// In case network Id is not defined yet, use default
	let networkId: ChainIds = DEFAULT_CHAIN_ID;
	if (chainId !== undefined) {
		networkId = chainId as ChainIds;
	}

	const { account, library } = useWeb3React();

	const { icedTxState } = useIcedTxContext();

	// icedTxState.condition.getConditionValueInput : icedTxState.action.getActionValueInput

	const [getValueState, setGetValueState] = React.useState(
		conditionOrAction === ConditionOrAction.Condition
			? icedTxState.condition.getConditionValueInput
			: icedTxState.action.getActionValueInput
	);
	// If globalState changes, call once
	useEffect(() => {
		let requestCancelled = false;
		if (inputs[0] !== undefined && !requestCancelled) {
			callGetValueAndSetState();

			// if component gets unmounted before async request is executed, abort controller
			return () => {
				requestCancelled = true;
			};
		}
	}, [icedTxState]);

	// On Summary page, refresh value every 5 seconds
	useEffect(() => {
		if (disabled) {
			const intervalId = setInterval(() => {
				callGetValueAndSetState();
			}, 15000);

			// this will clear Timeout when component unmont like in willComponentUnmount

			return () => clearInterval(intervalId);
		}
		// Clean up function
	}, []);

	// Func should call getValue() in smart contract and return the respective value in a disabled Text field
	// Params: Contract address | Contract Parameters
	const callGetValue = async () => {
		// Get abi
		let newValue =
			conditionOrAction === ConditionOrAction.Condition
				? icedTxState.condition.getConditionValueInput
				: icedTxState.action.getActionValueInput;
		// WHen on summary page, return global state
		// if (disabled) return newValue;

		if (active && account) {
			// let abi = '';
			// conditionOrAction === ConditionOrAction.Condition
			// 	? (abi = icedTxState.condition.getConditionValueAbi)
			// 	: (abi = icedTxState.action.getActionValueAbi);

			try {
				// Find token object by address
				// const signer = library.getSigner();
				// const signer = ethers.getDefaultProvider();
				const signer = library.getSigner();

				if (conditionOrAction === ConditionOrAction.Condition) {
					let conditionAddress = '';
					let abi = '';
					if (condition) {
						conditionAddress = condition.address[networkId];
						abi = condition.getConditionValueAbi;
					}

					const conditionContract = new ethers.Contract(
						conditionAddress,
						[abi],
						signer
					);

					// get value
					try {
						newValue = await conditionContract.getConditionValue(
							...inputs
						);
						console.log(newValue);

						// convert Value into human readable form
						return newValue;
					} catch (error) {
						console.log(error);
						newValue = BIG_NUM_ZERO;
						return newValue;
					}
				}
				// IF it is an action
				else {
					let actionAddress = '';
					let abi = '';
					if (action) {
						actionAddress = action.address[networkId];
						abi = action.getActionValueAbi;
					}
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

						newValue = await actionContract.getUsersSendTokenBalance(
							...copyUserInput
						);
						// Convert fetched wei amount to human reable amount

						// convert Value into human readable form
						return newValue;
					} catch (error) {
						// console.log(error);
						newValue = BIG_NUM_ZERO;
						// console.log(2);
						return newValue;
					}
				}
			} catch (error) {
				// console.log('token not in state yet');
				// console.log(error);
				newValue = BIG_NUM_ZERO;
				// console.log(error);
				// console.log(3);
				return newValue;
			}
		} else {
			// console.log('catch2');
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

	// if (!disabled) {
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
			conditionOrAction={conditionOrAction}
			relevantInputData={relevantInputData}
			key={`getValue-input-${conditionOrAction}-${index}`}
		></ReactNumberFormat>
	);
	// } else {
	// 	return <React.Fragment></React.Fragment>;
	// }
};

export default StatelessGetValueInput;
