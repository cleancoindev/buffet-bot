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
import { SELECTED_CHAIN_ID, BIG_NUM_ZERO } from '../../constants/constants';
import ReactNumberFormat from './ReactNumberFormat';
import { useIcedTxContext } from '../../state/GlobalState';
import { getTokenByAddress } from '../../helpers/helpers';

interface ReactNumberFormatProps {
	label: string;
	index: number;
	updateUserInput: Function;
	inputType: InputType;
	inputs: Array<string | number | ethers.utils.BigNumber | boolean>;
	disabled: boolean;
	tokenIndex: number;
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
		tokenIndex,
		triggerOrAction,
		trigger,
		action,
		relevantInputData
	} = props;
	// console.log(inputs);

	const classes = useStyles();
	const { chainId, active } = useWeb3React();

	// In case network Id is not defined yet, use default
	let networkId: ChainIds = SELECTED_CHAIN_ID;
	if (chainId !== undefined) {
		networkId = chainId as ChainIds;
	}

	const { account, library } = useWeb3React();
	const { dispatch, icedTxState } = useIcedTxContext();

	const [getValueState, setGetValueState] = React.useState(
		icedTxState.trigger.getTriggerValueInput
	);
	console.log('Render');
	// If globalState changes, call once
	useEffect(() => {
		console.log('useEFF');
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

		if (trigger && active && account) {
			const abi = trigger.getTriggerValueAbi;
			const triggerAddress = trigger.address[chainId as ChainIds];

			const tokenAddress = inputs[tokenIndex] as string;
			let token: Token;
			try {
				token = getTokenByAddress(
					tokenAddress,
					chainId as ChainIds,
					relevantInputData
				);
			} catch (error) {
				newValue = BIG_NUM_ZERO;
				return newValue;
			}

			try {
				// Find token object by address
				const signer = library.getSigner();

				const triggerContract = new ethers.Contract(
					triggerAddress,
					[abi],
					signer
				);

				// get value
				try {
					newValue = await triggerContract.getTriggerValue(...inputs);
					// Convert fetched wei amount to human reable amount

					// convert Value into human readable form
					return newValue;
				} catch (error) {
					// console.log(error);
					newValue = BIG_NUM_ZERO;
					// console.log(2);
					return newValue;
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
				newValue = BIG_NUM_ZERO;
				// console.log(3);
				return newValue;
			}
		} else {
			newValue = BIG_NUM_ZERO;
			// console.log(4);
			return newValue;
		}
	};

	async function callGetValueAndSetState() {
		// Only at first render set state, otherwise infinite loop
		const returnValue = await callGetValue();
		console.log(returnValue);
		// updateUserInput(index, returnValue);
		// Only set state if the return value is different
		if (!returnValue.eq(getValueState)) {
			console.log('setting local state');
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
				convertToWei
				disabled={true}
				tokenIndex={tokenIndex}
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
