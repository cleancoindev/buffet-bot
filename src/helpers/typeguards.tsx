import { ethers } from 'ethers';

export const isBool = (
	input: string | number | ethers.utils.BigNumber | boolean
): input is boolean => {
	return typeof input === 'boolean';
};

export const isBigNumber = (
	input: string | number | ethers.utils.BigNumber | boolean
): input is ethers.utils.BigNumber => {
	return typeof input === 'bigint';
};

export const isString = (
	input: string | number | ethers.utils.BigNumber | boolean
): input is string => {
	return typeof input === 'string';
};
