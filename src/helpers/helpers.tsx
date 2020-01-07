import { ATYPES, CTYPES, TOKEN_LIST } from '../constants/whitelist';
import {
	DEFAULT_DATA_ACTION,
	DEFAULT_DATA_CONDITION
} from '../constants/constants';
import { utils, ethers } from 'ethers';
import { Params } from '../constants/interfaces';

export function stringifyTimestamp(timestamp: string) {
	let date = new Date(parseInt(timestamp) * 1000);
	return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
}

export function decodePayload(payload: string, inputTypes: Array<Params>) {
	// do ethers.js decoding like in well timed
	return ['0x0', '0x1', '1', '1200'];
}

export function findConditionById(id: string) {
	let returnData = DEFAULT_DATA_CONDITION;

	CTYPES.forEach(type => {
		if (type.id === parseInt(id)) {
			returnData = type;
		}
	});
	return returnData;
}

export function findConditionByAddress(address: string) {
	let returnData = DEFAULT_DATA_CONDITION;

	CTYPES.forEach(type => {
		if (type.address === address) {
			returnData = type;
		}
	});
	return returnData;
}

export function findActionById(id: string) {
	let returnData = DEFAULT_DATA_ACTION;
	ATYPES.forEach(type => {
		if (type.id === parseInt(id)) {
			returnData = type;
		}
	});
	return returnData;
}

export function findActionByAddress(address: string) {
	let returnData = DEFAULT_DATA_ACTION;
	ATYPES.forEach(type => {
		if (type.address === address) {
			returnData = type;
		}
	});
	return returnData;
}
// @DEV Potenital bug in returning error string
export function getTokenSymbol(address: string) {
	const token = TOKEN_LIST.find(token => token.address === address);
	return token === undefined ? 'ERROR Get Token Symbol' : token.symbol;
}

// @DEV Potenital bug in returning error string
export function getTokenByAddress(address: string) {
	const token = TOKEN_LIST.find(token => token.address === address);
	if (token === undefined) {
		throw Error('Could not find Token with selected addrress');
	} else {
		return token;
	}
}

export function encodeActionPayload(
	userInput: Array<string | number | ethers.utils.BigNumber>,
	inputParameter: Array<Params>,
	user: string
) {
	const actionKyberTradeABI = [
		{
			name: 'action',
			type: 'function',
			inputs: inputParameter
		}
	];
	const iFace = new utils.Interface(actionKyberTradeABI);
	//@DEV CHANGE UINT inputs into BigNumbers

	// Insert user address into userInput Array at index 0
	// Make copy to not change global userInput variable
	const copyUserInput = [...userInput];
	copyUserInput.splice(0, 0, user);

	const actionPayloadWithSelector = iFace.functions.action.encode(
		copyUserInput
	);

	return actionPayloadWithSelector;
}

export function encodeTriggerPayload(
	userInput: Array<string | number | ethers.utils.BigNumber>,
	inputParameter: Array<Params>
) {
	const triggerTimestampPassedABI = [
		{
			name: 'fired',
			type: 'function',
			inputs: inputParameter
		}
	];
	const iFace = new utils.Interface(triggerTimestampPassedABI);
	const timestamp = '0';

	const triggerPayloadWithSelector = iFace.functions.fired.encode(userInput);

	return triggerPayloadWithSelector;
}
