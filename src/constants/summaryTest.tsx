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
			)} ${
				getTokenByAddress(
					inputs[1] as string,
					networkId,
					relevantInputData
				).symbol
			}`;
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
			}`;
		case 3:
			return `When the following date has been reached: ${timestampToDate(
				inputs[0] as number
			)} `;
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
		// Send Tokens
		case 1:
			return `Then your gelato bot will send ${convertWeiToHumanReadableForTokenAmount(
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
		// Trade Tokens on Kyber
		case 2:
			return `Then your gelato bot will sell ${convertWeiToHumanReadableForTokenAmount(
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
			} for ${
				getTokenByAddress(
					inputs[2] as string,
					networkId,
					relevantInputData
				).symbol
			} on Kyber`;
		// Buy Leverage Tokens on Fulcrum
		case 3:
			return `Then your gelato bot will sell ${convertWeiToHumanReadableForTokenAmount(
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
			} for ${
				getTokenByAddress(
					inputs[2] as string,
					networkId,
					relevantInputData
				).symbol
			} (${
				getTokenByAddress(
					inputs[2] as string,
					networkId,
					relevantInputData
				).name
			}) tokens on Fulcrum`;
		// Sell Leverage Tokens on Fulcrum
		case 4:
			return `Then your gelato bot will sell ${convertWeiToHumanReadableForTokenAmount(
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
			} (${
				getTokenByAddress(
					inputs[0] as string,
					networkId,
					relevantInputData
				).name
			}) tokens for ${
				getTokenByAddress(
					inputs[2] as string,
					networkId,
					relevantInputData
				).symbol
			} on Fulcrum`;

		default:
			return '';
	}
};

export const getStatusText = (status: string) => {
	switch (status) {
		case 'open':
			return 'open';
			break;
		case 'executedSuccess':
			return 'succesfully executed';
			break;
		case 'executedFailure':
			return 'failed to execute - please contact us';
			break;
		case 'cancelled':
			return 'cancelled';
			break;
		case 'expired':
			return 'expired';
			break;
		default:
			return 'error';
	}
};
