import { ethers, BigNumber } from 'ethers';

export const isBool = (
	input: string | number | BigNumber | boolean
): input is boolean => {
	return typeof input === 'boolean';
};

export const isBigNumber = (
	input: string | number | BigNumber | boolean
): input is BigNumber => {
	return typeof input === 'bigint';
};

export const isString = (
	input: string | number | BigNumber | boolean
): input is string => {
	return typeof input === 'string';
};
