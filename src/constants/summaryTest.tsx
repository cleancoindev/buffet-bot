import {
	InputType,
	ChainIds,
	RelevantInputData,
	ConditionOrAction
} from './interfaces';
import { ethers } from 'ethers';
import {
	getTokenByAddress,
	convertWeiToHumanReadableForTokenAmount,
	convertWeiToHumanReadableForNumbersAndGetValue
} from '../helpers/helpers';
import { timestampToDate } from '../components/Inputs/DatePicker';

export const getTriggerText = (
	inputs: Array<string | number | boolean | ethers.utils.BigNumber>,
	id: number,
	networkId: ChainIds,
	relevantInputData: RelevantInputData
): string => {
	switch (id) {
		// Token balance
		case 1:
			return `If the ${
				getTokenByAddress(
					inputs[1] as string,
					networkId,
					relevantInputData
				).symbol
			} balance of address ${inputs[0]} ${
				inputs[3] ? 'is higher or equal to' : 'is lower or equal to'
			} ${convertWeiToHumanReadableForTokenAmount(
				inputs[2] as ethers.utils.BigNumber,
				getTokenByAddress(
					inputs[1] as string,
					networkId,
					relevantInputData
				).decimals
			)}, then `;
		// Price on Kyber
		/*
            'Sell Token',
			'Sell Volume',
			'Buy Token',
			'Price activating condition',
			'',

        */
		case 2:
			return `If the price on Kyber for 1 ${
				getTokenByAddress(
					inputs[0] as string,
					networkId,
					relevantInputData
				).symbol
			} is equal to ${convertWeiToHumanReadableForNumbersAndGetValue(
				inputs[3] as ethers.utils.BigNumber,
				getTokenByAddress(
					inputs[2] as string,
					networkId,
					relevantInputData
				),
				ConditionOrAction.Condition,
				id
			)} ${
				getTokenByAddress(
					inputs[2] as string,
					networkId,
					relevantInputData
				).symbol
			}, based on a sell volume of ${convertWeiToHumanReadableForTokenAmount(
				inputs[1] as ethers.utils.BigNumber,
				getTokenByAddress(
					inputs[0] as string,
					networkId,
					relevantInputData
				).decimals
			)} ${
				getTokenByAddress(
					inputs[0] as string,
					networkId,
					relevantInputData
				).symbol
			}, then `;
		case 3:
			return `On the following date: ${timestampToDate(
				inputs[0] as number
			)}, `;
		default:
			return '';
	}
};

export const getActionText = (
	inputs: Array<string | number | boolean | ethers.utils.BigNumber>,
	id: number,
	networkId: ChainIds,
	relevantInputData: RelevantInputData
): string => {
	switch (id) {
		// Token balance
		case 1:
			return `your gelato bot will send ${convertWeiToHumanReadableForTokenAmount(
				inputs[1] as ethers.utils.BigNumber,
				getTokenByAddress(
					inputs[0] as string,
					networkId,
					relevantInputData
				).decimals
			)} ${
				getTokenByAddress(
					inputs[0] as string,
					networkId,
					relevantInputData
				).symbol
			} to address ${inputs[2]}`;
		default:
			return '';
	}
};
