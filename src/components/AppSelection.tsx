import React, { Props, useEffect } from "react";

// Routing
import { Link, useHistory } from "react-router-dom";

// Context API

// Material UI components
import Grid from "@material-ui/core/Grid";

import Button from "@material-ui/core/Button";

import { ATYPES, TTYPES, GELATO_CORE_ADDRESS } from "../constants/whitelist";

// Material UI
import { makeStyles } from "@material-ui/core/styles";

// Import Interfaces
import { ChainIds } from "../constants/interfaces";
import { COLOURS, BOX } from "../constants/constants";
import ERC20_ABI from "../constants/abis/erc20.json";

import { useWeb3React } from "@web3-react/core";
import {
	convertWeiToHumanReadableForTokenAmount,
	getWhitelistGelatoOnSafePayload,
	findConditionById,
	findActionById,
	getWhitelistGelatoOnSafePayloadOld,
	encodeConditionPayload,
	encodeActionPayloadTwo,
	calculateUniswapPrice
} from "../helpers/helpers";
import Chart from "./Chart";
import EthInput from "./EthInput";
import { ethers, BigNumber } from "ethers";
import { useGelatoCore } from "../hooks/hooks";
import { CircularProgress } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
	box: {
		...BOX
	},
	boxTitle: {
		fontSize: "18px",
		// fontWeight: 'bold',
		marginLeft: "10px",
		marginBottom: "0px",
		color: "white",
		textAlign: "left"
	},
	createButton: {
		fontSize: "18px",

		background: COLOURS.salmon60,
		minWidth: "100px",
		color: "white",
		border: 0,
		borderRadius: 3,
		boxShadow: "0 1.5px 1.5px 1.5px rgba(255, 255, 255, .3)",
		height: 48,
		padding: "0 20px",
		margin: 8,
		// marginBottom: '40px',
		"&:hover": {
			background: COLOURS.salmon
		}
	}
}));

export default function AppSelection() {
	const classes = useStyles();
	// Import global state
	//const { updateIcedTx, icedTxState, resetIcedTxInput } = useIcedTxContext();

	const web3 = useWeb3React();

	const DAI = "0xC4375B7De8af5a38a93548eb8453a498222C4fF2";

	const history = useHistory();

	const gelatoCore = useGelatoCore();

	const [currentIndex, setCurrentIndex] = React.useState(80);

	const [ethNum, setEthNum] = React.useState(ethers.constants.WeiPerEther);

	const [connectorModalOpen, setConnectorModalOpen] = React.useState(false);

	const [userIsInvested, setUserIsInvested] = React.useState(false);

	const [userIsRegistered, setUserIsRegistered] = React.useState(false);

	const [waiting, setWaiting] = React.useState(false);

	const [currentTotalPortfolio, setCurrentTotalPortfolio] = React.useState(
		ethers.constants.Zero
	);

	const [ethHoldings, setEthHoldings] = React.useState(ethers.constants.Zero);

	const [daiHolding, setDaiHoldings] = React.useState(ethers.constants.Zero);

	// ON Mounting, set error to False

	// useEffect(() => {
	// 	// callFearGreedApi();
	// 	callGraphApi();
	// }, []);

	const lookForProxy = async () => {
		try {
			const proxyAddress = await gelatoCore.gelatoProxyByUser(web3.account);
			if (
				ethers.utils.getAddress(proxyAddress) !==
				ethers.utils.getAddress(ethers.constants.AddressZero)
			) {
				console.log(proxyAddress);
				console.log("proxy found");
				setUserIsRegistered(true);
				setUserIsInvested(true);
			} else {
				setUserIsInvested(false);
				setUserIsRegistered(false);
			}
		} catch (error) {
			setUserIsInvested(false);
			setUserIsRegistered(false);
			console.log(error);
		}
	};

	useEffect(() => {
		if (web3.active) {
			console.log();
			lookForProxy();
		}
	}, [web3.active, web3.account]);

	const registerUser = async () => {
		let networkId: ChainIds;
		if (web3.chainId && web3.account) {
			networkId = web3.chainId as ChainIds;
			// const [
			// 	gnosisSafeMasterCopy,
			// 	setupPayload
			// ] = getWhitelistGelatoOnSafePayload(web3.account, networkId);

			const [
				gnosisSafeMasterCopy,
				setupPayload
			] = getWhitelistGelatoOnSafePayloadOld(web3.account, networkId);

			const gasEstimate = await gelatoCore.estimate.createGelatoUserProxy(
				gnosisSafeMasterCopy,
				setupPayload
			);

			let overrides = {
				// The maximum units of gas for the transaction to use
				gasLimit: BigNumber.from("50000").add(BigNumber.from(gasEstimate)),

				// The price (in wei) per unit of gas
				gasPrice: 8000000000
				// value: ethers.utils.parseUnits("0.5", "Ether")
			};

			try {
				const tx = await gelatoCore.createGelatoUserProxy(
					gnosisSafeMasterCopy,
					setupPayload,
					overrides
				);
				setWaiting(true);
				console.log(tx);
				await tx.wait();
				setWaiting(false);
				console.log("Successfully executed");
				setUserIsRegistered(true);
			} catch (error) {
				if (error.code === "INVALID_ARGUMENT") {
					console.log("Successfully executed");
					setUserIsRegistered(true);
				}
				setWaiting(false);
				console.log("Error");
				console.log(error);
			}
		}
	};

	const calculateProxyAddress = async () => {
		let networkId: ChainIds;
		if (web3.chainId && web3.account) {
			networkId = web3.chainId as ChainIds;
			const [
				gnosisSafeMasterCopy,
				setupPayload
			] = getWhitelistGelatoOnSafePayload(web3.account, networkId);

			const calcProxyAbi = [
				"function calculateCreateProxyWithNonceAddress(address _mastercopy, bytes initializer, uint256 saltNonce) returns (GnosisSafeProxy proxy)"
			];

			const signer = web3.library.getSigner();
			const gnosisContract = new ethers.Contract(
				gnosisSafeMasterCopy,
				calcProxyAbi,
				signer
			);
			try {
				const tx = await gnosisContract.calculateCreateProxyWithNonceAddress(
					gnosisSafeMasterCopy,
					setupPayload,
					999,
					{ gasLimit: 2000000 }
				);
				console.log(tx);
				await tx.wait();
				console.log("success");
			} catch (error) {
				console.log(error);
			}
		}
	};

	const activateBot = async (weiValue: BigNumber) => {
		let networkId: ChainIds;
		if (web3.chainId && web3.account) {
			networkId = web3.chainId as ChainIds;

			const proxyAddress = await gelatoCore.gelatoProxyByUser(web3.account);

			const signer = web3.library.getSigner();

			const selectedProviderAndExecutor = [
				"0x7015763d0a8F04263633106DE7a8F33B2334E51e",
				"0x4d671CD743027fB5Af1b2D2a3ccbafA97b5B1B80"
			];

			const conditionAndAction = [
				"0x4131A080145F39424cdeb4645bA673b53570CAB3",
				"0x8FEb96c37AAFE8980176D70Ac39dAf10b4121e8E"
			];

			const condition = findConditionById("4");
			const action = findActionById("10");

			const conditionPayload = encodeConditionPayload([0], condition.abi);
			const actionPayload = encodeActionPayloadTwo([], action.abi);

			let overrides = {
				// The maximum units of gas for the transaction to use
				gasLimit: 3000000,

				// The price (in wei) per unit of gas
				gasPrice: 2000000000
			};
			/*
			 address _selectedExecutor,
			IGelatoCondition _condition,
			bytes calldata _conditionPayloadWithSelector,
			IGelatoAction _action,
			bytes calldata _actionPayloadWithSelector
			*/
			try {
				const tx = await gelatoCore.mintExecutionClaim(
					selectedProviderAndExecutor,
					conditionAndAction,
					conditionPayload,
					actionPayload,
					// @DEV make dynamic
					overrides
				);
				setWaiting(true);
				await tx.wait();
				setWaiting(false);
				setUserIsInvested(true);

				// console.log('Change TxState to postCreate');
			} catch (error) {
				setWaiting(false);
				// console.log(error);
				// console.log(error.code);
				// Handle weird Wallet Connect Error
				if (error.code === "INVALID_ARGUMENT") {
					setUserIsInvested(true);
				} else {
					// console.log('Change TxState to cancelled');
					setUserIsInvested(false);
				}
			}
		}
	};

	const getEvents = async () => {
		// console.log(transactionByHash);
		const startBlock = 17092969;
		const endBlock = startBlock + 1;
		const signer = web3.library.getSigner();
		const proxyAddress = await gelatoCore.gelatoProxyByUser(web3.account);
		// const abi = [
		// 	'event LogOneWay(address origin, address sendToken, uint256 sendAmount, address destination)'
		// ];

		const filter = {
			address: GELATO_CORE_ADDRESS[web3.chainId as ChainIds],
			fromBlock: startBlock
		};

		// const logsExecutionClaimMinted = await signer.getLogs(
		// 	filter
		// );

		const abi = [
			`function execute(
				address[2] _selectedProviderAndExecutor,
				uint256 _executionClaimId,
				address _userProxy,
				address[2] _conditionAndAction,
				bytes _conditionPayload,
				bytes _actionPayload,
				uint256 _executionClaimExpiryDate
			)`
		];
		let iface = new ethers.utils.Interface(abi);

		const logs = await web3.library.getLogs(filter);
		console.log(logs);
		logs.forEach((log: any) => {
			try {
				let event = iface.parseLog(log);
				console.log(event);
			} catch (error) {
				console.log(error);
			}
		});
	};

	const calculatePortfolioValue = async () => {
		if (web3.active && userIsInvested) {
			const proxyAddress = await gelatoCore.gelatoProxyByUser(web3.account);
			console.log(proxyAddress);
			const signer = web3.library.getSigner();
			const erc20 = new ethers.Contract(DAI, JSON.stringify(ERC20_ABI), signer);
			const decimalConverter = 100000000;
			const balance = await erc20.balanceOf(proxyAddress);

			if (!balance.eq(ethers.constants.Zero)) {
				setDaiHoldings(balance);
				let humanReadableBalanceDai = convertWeiToHumanReadableForTokenAmount(
					balance,
					18
				);
				humanReadableBalanceDai = (
					Math.floor(parseFloat(humanReadableBalanceDai) * decimalConverter) /
					decimalConverter
				).toFixed(8);
				console.log(humanReadableBalanceDai);
			}
			const balanceEth = await web3.library.getBalance(proxyAddress);

			console.log(balanceEth.toString());
			if (!balanceEth.eq(ethers.constants.Zero)) {
				setEthHoldings(balanceEth);
				let humanReadableBalanceEth = convertWeiToHumanReadableForTokenAmount(
					balanceEth,
					18
				);
				humanReadableBalanceEth = (
					Math.floor(parseFloat(humanReadableBalanceEth) * decimalConverter) /
					decimalConverter
				).toFixed(8);
				console.log(humanReadableBalanceEth);
				let ethInDai = await calculateUniswapPrice(signer, DAI, balanceEth);
				const totalDai = ethInDai.add(balance);
				setCurrentTotalPortfolio(totalDai);
				console.log(totalDai);
			}
		}
	};

	useEffect(() => {
		// if (web3.active) {
		// 	getEvents();
		// }
	}, [web3.active]);

	useEffect(() => {
		calculatePortfolioValue();
	}, [web3.active, userIsInvested]);

	const activateBotViaGnosisSafe = async (weiValue: BigNumber) => {
		const swapAndMintAddress = "0x600Ef2B5F0DA93f797FE32069cB319D411eca02E";
		let networkId: ChainIds;
		if (web3.chainId && web3.account) {
			networkId = web3.chainId as ChainIds;

			/*
			function execTransaction(
				address to,
				uint256 value,
				bytes calldata data,
				Enum.Operation operation,
				uint256 safeTxGas,
				uint256 baseGas,
				uint256 gasPrice,
				address gasToken,
				address payable refundReceiver,
				bytes calldata signatures
			)
			*/

			const gnosisSafeAbi = [
				"function execTransaction(address to, uint256 value, bytes data, uint256 operation, uint256 safeTxGas, uint256 baseGas, uint256 gasPrice, address gasToken, address refundReceiver, bytes signatures) returns (bool success)"
			];

			const proxyAddress = await gelatoCore.gelatoProxyByUser(web3.account);

			const signer = web3.library.getSigner();

			const proxyContract = new ethers.Contract(
				proxyAddress,
				gnosisSafeAbi,
				signer
			);

			// try {
			// 	let sendEth = {
			// 		to: "0x88a5c2d9919e46f883eb62f7b8dd9d0cc45bc290",
			// 		// ... or supports ENS names
			// 		// to: "ricmoo.firefly.eth",

			// 		// We must pass in the amount as wei (1 ether = 1e18 wei), so we
			// 		// use this convenience function to convert ether to wei.
			// 		value: weiValue
			// 	};
			// 	const response = await signer.sendTransaction(sendEth);
			// 	console.log(response);
			// 	await response.wait();
			// 	console.log("Successfully send ETH");
			// } catch (error) {
			// 	console.log("Error haut sich nicht");
			// }

			/// @param to Destination address of Safe transaction.
			/// @param value Ether value of Safe transaction.
			/// @param data Data payload of Safe transaction.
			/// @param operation Operation type of Safe transaction.
			/// @param safeTxGas Gas that should be used for the Safe transaction.
			/// @param baseGas Gas costs for that are indipendent of the transaction execution(e.g. base transaction fee, signature check, payment of the refund)
			/// @param gasPrice Gas price that should be used for the payment calculation.
			/// @param gasToken Token address (or 0 if ETH) that is used for the payment.
			/// @param refundReceiver Address of receiver of gas payment (or 0 if tx.origin).
			/// @param signatures Packed signature data ({bytes32 r}{bytes32 s}{uint8 v})

			const to = swapAndMintAddress;
			const value = weiValue;

			// // Cancel script encodeing
			// const selectedProviderAndExecutor = [
			// 	"0x7015763d0a8F04263633106DE7a8F33B2334E51e",
			// 	"0x4d671CD743027fB5Af1b2D2a3ccbafA97b5B1B80"
			// ];

			// const conditionAndAction = [
			// 	"0x4131A080145F39424cdeb4645bA673b53570CAB3",
			// 	"0x8FEb96c37AAFE8980176D70Ac39dAf10b4121e8E"
			// ];

			// const condition = findConditionById("4");
			// const action = findActionById("10");

			// const conditionPayload = encodeConditionPayload([50], condition.abi);
			// const actionPayload = encodeActionPayloadTwo([], action.abi);
			const swapAndMintAbi = ["function swapAndMint(address _gelatoCore)"];

			const iFaceSetupModule = new ethers.utils.Interface(swapAndMintAbi);
			const data = iFaceSetupModule.encodeFunctionData("swapAndMint", [
				GELATO_CORE_ADDRESS[networkId]
			]);

			const operation = 1;

			const safeTxGas = ethers.constants.Zero;

			const baseGas = ethers.constants.Zero;

			const gasPrice = ethers.constants.Zero;

			const gasToken = ethers.constants.AddressZero;

			const refundReceiver = ethers.constants.AddressZero;

			let address = web3.account;

			const signatures = `0x000000000000000000000000${address.replace(
				"0x",
				""
			)}000000000000000000000000000000000000000000000000000000000000000001`;

			// // Cancel Script Params
			// function cancelPortfolioRebalancingAndWithdraw(
			// 	address _gelatoCore,
			// 	address[2] calldata _selectedProviderAndExecutor,
			// 	uint256 _executionClaimId,
			// 	address _userProxy,
			// 	address[2] calldata _conditionAndAction,
			// 	bytes calldata _conditionPayload,
			// 	bytes calldata _actionPayload,
			// 	uint256 _executionClaimExpiryDate
			// )

			// const inputs = [

			// ]

			const gasEstimate = await proxyContract.estimate.execTransaction(
				to,
				value,
				data,
				operation,
				safeTxGas,
				baseGas,
				gasPrice,
				gasToken,
				refundReceiver,
				signatures
			);

			let overrides = {
				// The maximum units of gas for the transaction to use
				gasLimit: 5000000,

				// The price (in wei) per unit of gas
				gasPrice: 8000000000
			};

			try {
				const tx = await proxyContract.execTransaction(
					to,
					value,
					data,
					operation,
					safeTxGas,
					baseGas,
					gasPrice,
					gasToken,
					refundReceiver,
					signatures,
					overrides
				);
				console.log(tx);
				await tx.wait();
				console.log("Successfully executed");
			} catch (error) {
				console.log("Error");
			}
		}
	};

	const init = async (weiAmount: BigNumber) => {
		if (web3.account) {
			const selectedProviderAndExecutor = [
				"0x7015763d0a8F04263633106DE7a8F33B2334E51e",
				"0x4d671CD743027fB5Af1b2D2a3ccbafA97b5B1B80"
			];

			const condition = findConditionById("4");
			const action = findActionById("10");

			const conditionAndAction = [
				condition.address[web3.chainId as ChainIds],
				action.address[web3.chainId as ChainIds]
			];

			const [
				gnosisSafeMasterCopy,
				setupPayload
			] = getWhitelistGelatoOnSafePayloadOld(
				web3.account,
				web3.chainId as ChainIds
			);

			const conditionPayload = encodeConditionPayload([0], condition.abi);
			const actionPayload = encodeActionPayloadTwo([], action.abi);

			console.log(`Wei sent: ${weiAmount.toString()}`);
			let overrides = {
				// The maximum units of gas for the transaction to use
				gasLimit: 3000000,

				// The price (in wei) per unit of gas
				gasPrice: 2000000000,
				value: weiAmount
			};
			/*
			 address _selectedExecutor,
			IGelatoCondition _condition,
			bytes calldata _conditionPayloadWithSelector,
			IGelatoAction _action,
			bytes calldata _actionPayloadWithSelector
			*/
			try {
				const tx = await gelatoCore.init(
					gnosisSafeMasterCopy,
					setupPayload,
					selectedProviderAndExecutor,
					conditionAndAction,
					conditionPayload,
					actionPayload,
					// @DEV make dynamic
					overrides
				);
				setWaiting(true);
				await tx.wait();
				setWaiting(false);
				setUserIsInvested(true);
				setUserIsRegistered(true);
			} catch (error) {
				setWaiting(false);
				// console.log(error);
				// console.log(error.code);
				// Handle weird Wallet Connect Error
				if (error.code === "INVALID_ARGUMENT") {
					setUserIsInvested(true);
					setUserIsRegistered(true);
				} else {
					// console.log('Change TxState to cancelled');
					setUserIsInvested(false);
					setUserIsRegistered(false);
				}
			}
		}
	};

	const returnHowGreedy = (currentIndex: number) => {
		if (currentIndex >= 60) return "greedy";
		else if (currentIndex === 50) return "neutral";
		else return "fearful";
	};

	return (
		<div /*className={classes.box}*/>
			{/* <h1>{`Instruct a conditional transaction by defining a condition and action`}</h1> */}
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
				// style={{ padding: '16px' }}
			>
				<div
					style={{
						textAlign: "justify",
						textAlignLast: "center",
						fontSize: "32px"
					}}
				>
					Automatically trade the{" "}
					<span style={{ color: COLOURS.salmon }}>{`fear & greed`}</span> index
				</div>

				<div
					style={{
						textAlign: "justify",
						textAlignLast: "center",
						fontSize: "18px",
						marginTop: "8px"
					}}
				>
					<p>
						"Be <span style={{ color: COLOURS.salmon }}>{`fearful`}</span> when
						others are greedy and{" "}
						<span style={{ color: COLOURS.salmon }}>{`greedy`}</span> when
						others are fearful"
					</p>
				</div>
			</Grid>
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
				style={{ marginTop: "24px" }}
				className={classes.box}
			>
				<Grid
					container
					item
					direction="column"
					justify="center"
					alignItems="center"
					style={{ marginTop: "24px" }}
				>
					<div
						style={{
							textAlign: "justify",
							textAlignLast: "center",
							fontSize: "18px"
						}}
					>
						<p>
							Current Fear And Greed Index:{" "}
							<span
								style={{ color: COLOURS.salmon }}
							>{`${currentIndex} (${returnHowGreedy(
								currentIndex
							)})`}</span>{" "}
						</p>
					</div>
				</Grid>
				<Grid
					container
					item
					direction="column"
					justify="center"
					alignItems="center"
					style={{ marginTop: "8px" }}
				>
					<div
						style={{
							textAlign: "justify",
							textAlignLast: "center",
							fontSize: "18px"
						}}
					>
						Current Portfolio Strategy:{" "}
						<span
							style={{ color: COLOURS.salmon }}
						>{`${currentIndex}% DAI | ${100 - currentIndex}% ETH`}</span>{" "}
					</div>
				</Grid>

				<Grid
					container
					item
					direction="column"
					justify="center"
					alignItems="center"
					style={{ marginTop: "24px" }}
				>
					<div
						style={{
							textAlign: "justify",
							textAlignLast: "center",
							fontSize: "18px"
						}}
					>
						<Chart></Chart>
					</div>
				</Grid>

				{userIsInvested && userIsRegistered && (
					<React.Fragment>
						<Grid
							container
							item
							direction="column"
							justify="center"
							alignItems="center"
							style={{ marginTop: "24px" }}
						>
							<div
								style={{
									textAlign: "justify",
									textAlignLast: "center",
									fontSize: "18px"
								}}
							>
								Your Current Portfolio Value:{" "}
								<span
									style={{ color: COLOURS.salmon }}
								>{`$${convertWeiToHumanReadableForTokenAmount(
									currentTotalPortfolio,
									18
								)}`}</span>{" "}
							</div>
						</Grid>
						<Grid
							container
							item
							direction="column"
							justify="center"
							alignItems="center"
							style={{ marginTop: "24px" }}
						>
							<div
								style={{
									textAlign: "justify",
									textAlignLast: "center",
									fontSize: "18px"
								}}
							>
								Your Current ETH Position:{" "}
								<span
									style={{ color: COLOURS.salmon }}
								>{`ETH ${convertWeiToHumanReadableForTokenAmount(
									ethHoldings,
									18
								)}`}</span>{" "}
							</div>
						</Grid>
						<Grid
							container
							item
							direction="column"
							justify="center"
							alignItems="center"
							style={{ marginTop: "24px" }}
						>
							<div
								style={{
									textAlign: "justify",
									textAlignLast: "center",
									fontSize: "18px"
								}}
							>
								Your Current DAI Position:{" "}
								<span
									style={{ color: COLOURS.salmon }}
								>{`DAI ${convertWeiToHumanReadableForTokenAmount(
									daiHolding,
									18
								)}`}</span>{" "}
							</div>
						</Grid>
						{/* <Grid
							container
							item
							direction="column"
							justify="center"
							alignItems="center"
							style={{ marginTop: "24px" }}
						>
							<div
								style={{
									textAlign: "justify",
									textAlignLast: "center",
									fontSize: "18px"
								}}
							>
								Your Initial Portfolio Value:{" "}
								<span style={{ color: COLOURS.salmon }}>{`$10.000`}</span>{" "}
							</div>
							<Divider
								style={{
									marginTop: "18px",
									width: "50%",
									backgroundColor: COLOURS.salmon
								}}
							></Divider>
						</Grid>
						<Grid
							container
							item
							direction="column"
							justify="center"
							alignItems="center"
							style={{ marginTop: "24px" }}
						>
							<div
								style={{
									textAlign: "justify",
									textAlignLast: "center",
									fontSize: "18px"
								}}
							>
								Your Portfolio Value Change:{" "}
								<span style={{ color: COLOURS.salmon }}>{`+$167`}</span>{" "}
							</div>
						</Grid> */}
					</React.Fragment>
				)}

				<Grid
					container
					item
					direction="row"
					justify="center"
					alignItems="center"
					style={{ marginTop: "32px", marginBottom: "24px" }}
				>
					{!userIsInvested && !userIsRegistered && (
						<div>
							<EthInput
								userIsInvested={userIsInvested}
								ethNum={setEthNum}
								defaultValue={ethNum}
							></EthInput>
						</div>
					)}
					<div>
						{web3.active && userIsRegistered && userIsInvested && !waiting && (
							<Button
								onClick={async () => {
									if (!userIsInvested) {
										console.log("Invest");
										await activateBot(ethNum);
										// await calculateProxyAddress();
									} else {
										console.log("Devest");
									}
								}}
								className={classes.createButton}
							>
								{`${
									userIsInvested
										? "Withdraw ETH & Deactivate Bot"
										: "Activate Bot"
								}`}
							</Button>
						)}
						{web3.active && !userIsRegistered && !waiting && (
							<Button
								onClick={async () => {
									console.log("Invest");
									// await registerUser();
									await init(ethNum);
									// await calculateProxyAddress();
								}}
								className={classes.createButton}
							>
								{`Deploy Bot`}
							</Button>
						)}
						{waiting && (
							<CircularProgress
								size={24}
								style={{ marginLeft: "16px" }}
								color={"primary"}
							/>
						)}

						{!web3.active && !waiting && (
							<Button
								onClick={() =>
									// dispatch({ type: OPEN_MODAL })
									setConnectorModalOpen(true)
								}
								className={classes.createButton}
							>
								Activate Bot
							</Button>
						)}
					</div>
				</Grid>

				{!userIsRegistered && (
					<Grid
						container
						item
						direction="column"
						justify="center"
						alignItems="center"
						style={{ marginTop: "8px", marginBottom: "24px" }}
					>
						{/* <div
							style={{
								textAlign: "justify",
								textAlignLast: "center",
								fontSize: "18px"
							}}
						>
							<p style={{ margin: "8px" }}>
								{`*When activating your bot, you will sell ${(parseFloat(
									(100 - currentIndex).toString()
								) /
									100) *
									parseFloat(
										convertWeiToHumanReadableForTokenAmount(ethNum, 18)
									)} ETH for DAI`}
							</p>
						</div> */}
						<div
							style={{
								textAlign: "justify",
								textAlignLast: "center",
								fontSize: "18px"
							}}
						>
							<p
								style={{ margin: "8px" }}
							>{`*Every triggered rebalance inccurs a 1% fee`}</p>
						</div>
					</Grid>
				)}
				{/* {!userIsRegistered && (
					<Grid
						container
						item
						direction="column"
						justify="center"
						alignItems="center"
						style={{ marginTop: "8px", marginBottom: "24px" }}
					>
						<div
							style={{
								textAlign: "justify",
								textAlignLast: "center",
								fontSize: "18px"
							}}
						>
							<p style={{ margin: "8px" }}>
								{`Step 1: Deploy your Bot to Ethereum`}
							</p>
						</div>
						<div
							style={{
								textAlign: "justify",
								textAlignLast: "center",
								fontSize: "18px"
							}}
						>
							<p style={{ margin: "8px" }}>
								{`Step 2: Fund your bot and activate the portfolio strategy`}
							</p>
						</div>
					</Grid>
				)} */}
			</Grid>
			<Grid
				container
				direction="row"
				justify="center"
				alignItems="center"
				style={{ marginTop: "16px", marginBottom: "24px" }}
			>
				<div
					style={{
						textAlign: "justify",
						textAlignLast: "center",
						fontSize: "18px"
					}}
				>
					<p style={{ margin: "8px" }}>{`Index Api:`}</p>
					<a
						href="https://alternative.me/crypto/fear-and-greed-index/"
						target="_blank"
					>
						Alternative.me
					</a>
					<p style={{ margin: "8px", fontSize: "14px" }}>
						(data is always rounded down. Portfolio rebalances if new index
						value is +/- 10 compared to old value)
					</p>
				</div>
			</Grid>
		</div>
	);
}
