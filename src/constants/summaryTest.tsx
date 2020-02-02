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

export const getConditionText = (
	inputs: Array<string | number | boolean | ethers.utils.BigNumber>,
	id: number,
	networkId: ChainIds,
	relevantInputData: RelevantInputData
): string => {
	switch (id) {
		// Time
		case 1:
			return `the following date has been reached: ${timestampToDate(
				inputs[0] as number
			)
				.toString()
				.substring(0, 24)} `;

		// Token Balance
		case 2: {
			let tokenBalance = inputs[2] as ethers.utils.BigNumber;
			if (tokenBalance.eq(ethers.constants.MaxUint256)) {
				tokenBalance = ethers.constants.Zero;
			}

			let tokenBalanceHumanReadable = convertWeiToHumanReadableForTokenAmount(
				tokenBalance,
				getTokenByAddress(
					inputs[1] as string,
					networkId,
					relevantInputData
				).decimals
			);
			return `the ${
				getTokenByAddress(
					inputs[1] as string,
					networkId,
					relevantInputData
				).symbol
			} balance of address ${inputs[0]} ${
				inputs[3] ? 'is higher or equal to' : 'is lower or equal to'
			} ${tokenBalanceHumanReadable} ${
				getTokenByAddress(
					inputs[1] as string,
					networkId,
					relevantInputData
				).symbol
			}`;
		}
		// Price on Kyber
		case 3: {
			let sellAmount = inputs[1] as ethers.utils.BigNumber;
			if (sellAmount.eq(ethers.constants.MaxUint256)) {
				sellAmount = ethers.constants.Zero;
			}

			const sellAmountHumanReadable = convertWeiToHumanReadableForTokenAmount(
				sellAmount,
				getTokenByAddress(
					inputs[0] as string,
					networkId,
					relevantInputData
				).decimals
			);
			const lessOrMore = inputs[4];
			let price = inputs[3] as ethers.utils.BigNumber;
			if (price.eq(ethers.constants.MaxUint256)) {
				price = ethers.constants.Zero;
			}
			const priceHumanReadable = convertWeiToHumanReadableForNumbersAndGetValue(
				price,
				getTokenByAddress(
					inputs[2] as string,
					networkId,
					relevantInputData
				),
				ConditionOrAction.Condition,
				id
			);

			const expectedBuyAmount =
				parseFloat(sellAmountHumanReadable) *
				parseFloat(priceHumanReadable);

			console.log(sellAmountHumanReadable);
			console.log(priceHumanReadable);

			const isOrAre = parseFloat(sellAmountHumanReadable) === 1.0;

			const sellSymbol = getTokenByAddress(
				inputs[0] as string,
				networkId,
				relevantInputData
			).symbol;

			const buySymbol = getTokenByAddress(
				inputs[2] as string,
				networkId,
				relevantInputData
			).symbol;

			let lessOrMoreText = '';
			if (!price.eq(ethers.constants.Zero)) {
				lessOrMoreText = lessOrMore ? 'or more' : 'or less';
			}

			const exchangeRate = `(1 ${sellSymbol} = ${priceHumanReadable} ${sellSymbol})`;

			return `${sellAmountHumanReadable} ${sellSymbol} ${
				isOrAre ? 'is' : 'are'
			} worth ${expectedBuyAmount} ${buySymbol} ${
				isOrAre ? '' : exchangeRate
			} ${lessOrMoreText} on Kyber `;
		}

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
		case 1: {
			let sendAmount = inputs[1] as ethers.utils.BigNumber;
			if (sendAmount.eq(ethers.constants.MaxUint256)) {
				sendAmount = ethers.constants.Zero;
			}

			const sendAmountHumanReadable = convertWeiToHumanReadableForTokenAmount(
				sendAmount,
				getTokenByAddress(
					inputs[0] as string,
					networkId,
					relevantInputData
				).decimals
			);
			return `your gelato bot will send ${sendAmountHumanReadable} ${
				getTokenByAddress(
					inputs[0] as string,
					networkId,
					relevantInputData
				).symbol
			} to address ${inputs[2]}`;
		}
		// Trade Tokens on Kyber
		case 2: {
			let sellAmount = inputs[1] as ethers.utils.BigNumber;
			if (sellAmount.eq(ethers.constants.MaxUint256)) {
				sellAmount = ethers.constants.Zero;
			}

			let sellAmountHumanReadable = convertWeiToHumanReadableForTokenAmount(
				sellAmount,
				getTokenByAddress(
					inputs[0] as string,
					networkId,
					relevantInputData
				).decimals
			);
			return `your gelato bot will sell ${sellAmountHumanReadable} ${
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
		}
		// Buy Leverage Tokens on Fulcrum
		case 3: {
			let sellAmount = inputs[1] as ethers.utils.BigNumber;
			if (sellAmount.eq(ethers.constants.MaxUint256)) {
				sellAmount = ethers.constants.Zero;
			}

			const sellAmountHumanReadable = convertWeiToHumanReadableForTokenAmount(
				sellAmount,
				getTokenByAddress(
					inputs[0] as string,
					networkId,
					relevantInputData
				).decimals
			);
			return `your gelato bot will sell ${sellAmountHumanReadable} ${
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
		}
		// Sell Leverage Tokens on Fulcrum
		case 4: {
			let sellAmount = inputs[1] as ethers.utils.BigNumber;
			if (sellAmount.eq(ethers.constants.MaxUint256)) {
				sellAmount = ethers.constants.Zero;
			}

			const sellAmountHumanReadable = convertWeiToHumanReadableForTokenAmount(
				sellAmount,
				getTokenByAddress(
					inputs[0] as string,
					networkId,
					relevantInputData
				).decimals
			);
			return `your gelato bot will sell ${sellAmountHumanReadable} ${
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
		}

		default:
			return '';
	}
};

export const getActionResultText = (
	inputs: Array<string | number | boolean | ethers.utils.BigNumber>,
	id: number,
	networkId: ChainIds,
	relevantInputData: RelevantInputData,
	sellAmount?: ethers.utils.BigNumber
): string => {
	switch (id) {
		// Send Tokens
		case 1:
			return `Your gelato bot transferred ${convertWeiToHumanReadableForTokenAmount(
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
			return `Your gelato bot sold ${convertWeiToHumanReadableForTokenAmount(
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
			} for ${convertWeiToHumanReadableForTokenAmount(
				sellAmount as ethers.utils.BigNumber,
				getTokenByAddress(
					inputs[2] as string,
					networkId,
					relevantInputData
				).decimals
			)} ${
				getTokenByAddress(
					inputs[2] as string,
					networkId,
					relevantInputData
				).symbol
			} on Kyber`;
		// Buy Leverage Tokens on Fulcrum
		case 3:
			return `Your gelato bot sold ${convertWeiToHumanReadableForTokenAmount(
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
			} for ${convertWeiToHumanReadableForTokenAmount(
				sellAmount as ethers.utils.BigNumber,
				getTokenByAddress(
					inputs[2] as string,
					networkId,
					relevantInputData
				).decimals
			)} ${
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
			return `Your gelato bot sold ${convertWeiToHumanReadableForTokenAmount(
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
			}) tokens for ${convertWeiToHumanReadableForTokenAmount(
				sellAmount as ethers.utils.BigNumber,
				getTokenByAddress(
					inputs[2] as string,
					networkId,
					relevantInputData
				).decimals
			)} ${
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
