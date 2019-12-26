import { ATYPES, CTYPES, TOKEN_LIST } from '../constants/whitelist';
import {
	DEFAULT_DATA_ACTION,
	DEFAULT_DATA_CONDITION
} from '../constants/constants';
import { utils } from 'ethers';

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

export function encodeActionPayload(user: string, userProxy: string) {
	const actionKyberTradeABI = [
		{
			name: 'action',
			type: 'function',
			inputs: [
				{ type: 'address', name: '_user' },
				// { type: 'address', name: '_userProxy' },
				{ type: 'address', name: '_src' },
				{ type: 'uint256', name: '_srcAmt' },
				{ type: 'address', name: '_dest' },
				{ type: 'uint256', name: '_minConversionRate' }
			]
		}
	];
	const iFace = new utils.Interface(actionKyberTradeABI);
	//@DEV CHANGE UINT inputs into BigNumbers
	const src = '0x6FA355a7b6bD2D6bD8b927C489221BFBb6f1D7B2';
	const srcAmt = '1000000000000000000';
	const dest = '0x732fBA98dca813C3A630b53a8bFc1d6e87B1db65';
	const minConversionRate = '0';

	const actionPayloadWithSelector = iFace.functions.action.encode([
		user,
		// userProxy,
		src,
		srcAmt,
		dest,
		minConversionRate
	]);

	return actionPayloadWithSelector;
}

export function encodeTriggerPayload() {
	const triggerTimestampPassedABI = [
		{
			name: 'fired',
			type: 'function',
			inputs: [{ type: 'uint256', name: '_timestamp' }]
		}
	];
	const iFace = new utils.Interface(triggerTimestampPassedABI);
	const timestamp = '0';

	const triggerPayloadWithSelector = iFace.functions.fired.encode([
		timestamp
	]);

	return triggerPayloadWithSelector;
}
