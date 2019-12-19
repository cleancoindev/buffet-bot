import { ATYPES, CTYPES } from '../constants/whitelist';
import {
	DEFAULT_DATA_ACTION,
	DEFAULT_DATA_CONDITION,
	TOKEN_LIST
} from '../constants/constants';

export function stringifyTimestamp(timestamp: string) {
	let date = new Date(parseInt(timestamp) * 1000);
	return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
}

export function decodePayload(payload: string, inputTypes: Array<string>) {
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
	ATYPES.map(type => {
		if (type.id === parseInt(id)) {
			returnData = type;
		}
	});
	return returnData;
}

export function findActionByAddress(address: string) {
	let returnData = DEFAULT_DATA_ACTION;
	ATYPES.map(type => {
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
