import { ATYPES, CTYPES } from '../constants/whitelist';
import {
	DEFAULT_DATA_ACTION,
	DEFAULT_DATA_CONDITION,
	TOKEN_LIST
} from '../constants/constants';

export function findCondition(id: string) {
	let returnData = DEFAULT_DATA_CONDITION;

	CTYPES.forEach(type => {
		if (type.id === parseInt(id)) {
			returnData = type;
		}
	});
	return returnData;
}

export function findAction(id: string) {
	let returnData = DEFAULT_DATA_ACTION;
	ATYPES.map(type => {
		if (type.id === parseInt(id)) {
			returnData = type;
		}
	});
	return returnData;
}

export function getTokenSymbol(address: string) {
	const token = TOKEN_LIST.find(token => token.address === address);
	return token === undefined ? 'ERROR Get Token Symbol' : token.symbol;
}
