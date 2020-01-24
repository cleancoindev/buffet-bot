import { RelevantInputData } from './interfaces';
// 'KYBER_TOKEN_LIST', 'NONE', 'FULCRUM_LEVERAGE_TOKEN_LIST']

// export enum TokenList {
//     KyberTokenList = 0
// }

export const KYBER_TOKEN_LIST = [
	{
		address: {
			1: '0x6b175474e89094c44da98b954eedeac495271d0f',
			3: '0x0',
			4: '0x0',
			42: '0xC4375B7De8af5a38a93548eb8453a498222C4fF2'
		},
		symbol: 'DAI',
		name: 'DAI Stablecoin',
		decimals: 18
	},
	// {
	// 	address: {
	// 		1: '0x6810e776880c02933d47db1b9fc05908e5386b96',
	// 		3: '0x0',
	// 		4: '0x0',
	// 		42: '0x0'
	// 	},
	// 	symbol: 'GNO',
	// 	name: 'Gnosis',
	// 	decimals: 18
	// },
	// {
	// 	address: {
	// 		1: '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
	// 		3: '0x0',
	// 		4: '0x0',
	// 		42: '0xcb78b457c1F79a06091EAe744aA81dc75Ecb1183'
	// 	},
	// 	symbol: 'MANA',
	// 	name: 'Decentraland',
	// 	decimals: 18
	// },
	{
		address: {
			1: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
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
			1: '0x514910771af9ca656af840dff83e8264ecf986ca',
			3: '0x0',
			4: '0x0',
			42: '0x0'
		},
		symbol: 'LINK',
		name: 'ChainLink',
		decimals: 18
	},
	{
		address: {
			1: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
			3: '0x0',
			4: '0x0',
			42: '0xAaF64BFCC32d0F15873a02163e7E500671a4ffcD'
		},
		symbol: 'MKR',
		name: 'Maker',
		decimals: 18
	},
	{
		address: {
			1: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
			3: '0x0',
			4: '0x0',
			42: '0x0'
		},
		symbol: 'SAI Stablecoin',
		name: 'SAI',
		decimals: 18
	},

	{
		address: {
			1: '0x4156D3342D5c385a87D264F90653733592000581',
			3: '0x0',
			4: '0x0',
			42: '0x6fEE5727EE4CdCBD91f3A873ef2966dF31713A04'
		},
		symbol: 'SALT',
		name: 'Salt',
		decimals: 8
	},
	{
		address: {
			1: '0xc011a72400e58ecd99ee497cf89e3775d4bd732f',
			3: '0x0',
			4: '0x0',
			42: '0x0'
		},
		symbol: 'SNX',
		name: 'Synthetix Network Token',
		decimals: 18
	},

	{
		address: {
			1: '0xdac17f958d2ee523a2206206994597c13d831ec7',
			3: '0x0',
			4: '0x0',
			42: '0x0'
		},
		symbol: 'USDT',
		name: 'Tether',
		decimals: 6
	},
	{
		address: {
			1: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
			3: '0x0',
			4: '0x0',
			42: '0x0'
		},
		symbol: 'USDC',
		name: 'USD Coin',
		decimals: 6
	},
	{
		address: {
			1: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
			3: '0x0',
			4: '0x0',
			42: '0xd0A1E359811322d97991E03f863a0C30C2cF029C'
		},
		symbol: 'WETH',
		name: 'Wrapped Ether',
		decimals: 18
	},
	{
		address: {
			1: '0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27',
			3: '0x0',
			4: '0x0',
			42: '0xAb74653cac23301066ABa8eba62b9Abd8a8c51d6'
		},
		symbol: 'ZIL',
		name: 'Zilliqa',
		decimals: 12
	}
];

export const FULCRUM_LEVERAGE_TOKEN_LIST = [
	{
		address: {
			1: '0xd80e558027ee753a0b95757dc3521d0326f13da2',
			3: '0x0',
			4: '0x0',
			42: '0x934b43143e984052961EB46f5bDE633F33bCDB80'
		},
		symbol: 'dLETH2x',
		name: '2x Long ETH',
		decimals: 18
	},
	{
		address: {
			1: '0x1370b716575bd7d5aee14128e231a779198e5397',
			3: '0x0',
			4: '0x0',
			42: '0x0015Cfd9722B43ac277f37887df14a00109fc689'
		},
		symbol: 'dLETH3x',
		name: '3x Long ETH',
		decimals: 18
	},
	{
		address: {
			1: '0xf2ad1ee9671f63df7c8f8daa822da1e6fc08b80d',
			3: '0x0',
			4: '0x0',
			42: '0x0E5f87BDcD6285F930b6bbcC3E21CA9d985e12fE'
		},
		symbol: 'dLETH4x',
		name: '4x Long ETH',
		decimals: 18
	},
	{
		address: {
			1: '0xd2a1d068baac0b06a8e2b1dc924a43d81a6da325',
			3: '0x0',
			4: '0x0',
			42: '0xD4Fd1467c867808dc7B393dBc863f34783F37d3E'
		},
		symbol: 'dsETH',
		name: 'Short ETH',
		decimals: 18
	},
	{
		address: {
			1: '0x8fa1a491f55d93bd40ff023956261f2fb5047297',
			3: '0x0',
			4: '0x0',
			42: '0x2EBfbCf2d67867a05BCAC0FbCA54019163253988'
		},
		symbol: 'dsETH2x',
		name: '2x Short ETH',
		decimals: 18
	},
	{
		address: {
			1: '0x0428488582472a47d7a20be969fdfdfb3ba1f7cb',
			3: '0x0',
			4: '0x0',
			42: '0xB56EA362eA9B1D030213A47eAA452dFfd84CB5a2'
		},
		symbol: 'dsETH3x',
		name: '3x Short ETH',
		decimals: 18
	},
	{
		address: {
			1: '0x46bb4576993f50302bb0d5f7440aeffbabfdbb78',
			3: '0x0',
			4: '0x0',
			42: '0x9486ac55ed81758787fcdda98e6Ce35b01CDBE72'
		},
		symbol: 'dsETH4x',
		name: '4x Short ETH',
		decimals: 18
	}
];

export const TOKEN_LIST = [
	{
		name: RelevantInputData.kyberTokenList,
		data: [...KYBER_TOKEN_LIST]
	},
	{
		name: RelevantInputData.fulcrumTokenList,
		data: [...FULCRUM_LEVERAGE_TOKEN_LIST]
	},
	{
		name: RelevantInputData.all,
		data: [...FULCRUM_LEVERAGE_TOKEN_LIST, ...KYBER_TOKEN_LIST]
	}
];
