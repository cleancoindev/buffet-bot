// 'KYBER_TOKEN_LIST', 'NONE', 'FULCRUM_LEVERAGE_TOKEN_LIST']

// export enum TokenList {
//     KyberTokenList = 0
// }

export const KYBER_TOKEN_LIST = [
	{
		address: {
			1: '0x0',
			3: '0x0',
			4: '0x0',
			42: '0xdB7ec4E4784118D9733710e46F7C83fE7889596a'
		},
		symbol: 'OMG',
		name: 'OmiseGo',
		decimals: 18
	},
	{
		address: {
			1: '0x0',
			3: '0x0',
			4: '0x0',
			42: '0xcb78b457c1F79a06091EAe744aA81dc75Ecb1183'
		},
		symbol: 'MANA',
		name: 'MANA',
		decimals: 18
	},
	{
		address: {
			1: '0x0',
			3: '0x0',
			4: '0x0',
			42: '0xad67cB4d63C9da94AcA37fDF2761AaDF780ff4a2'
		},
		symbol: 'KNC',
		name: 'Kyber Network',
		decimals: 18
	},
	{
		address: {
			1: '0x0',
			3: '0x0',
			4: '0x0',
			42: '0xC4375B7De8af5a38a93548eb8453a498222C4fF2'
		},
		symbol: 'DAI',
		name: 'DAI',
		decimals: 18
	}
];

export const TOKEN_LIST = {
	KYBER_TOKEN_LIST: [...KYBER_TOKEN_LIST]
};
