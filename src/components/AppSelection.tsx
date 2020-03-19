import React, { Props, useEffect } from "react";

// Routing
import { Link, useHistory } from "react-router-dom";

// Context API

// Material UI components
import Grid from "@material-ui/core/Grid";

import Button from "@material-ui/core/Button";

import {
  ATYPES,
  TTYPES,
  GELATO_CORE_ADDRESS,
  SELECTED_PROVIDER_AND_EXECUTOR,
  CONDITION_AND_ACTION,
  MASTERCOPY,
  SCRIPT_ENTER_PORTFOLIO_REBALANCING,
  PAYABLE_FACTORY,
  SCRIPT_EXIT_PORTFOLIO_REBALANCING
} from "../constants/whitelist";

// Material UI
import { makeStyles } from "@material-ui/core/styles";

// Import Interfaces
import { ChainIds } from "../constants/interfaces";
import { COLOURS, BOX } from "../constants/constants";

// ABIs
import ERC20_ABI from "../constants/abis/erc20.json";
import SCRIPT_ENTER_REBLANCING_PORTFOLIO_ABI from "../constants/abis/scriptEnterPortfolioRebalancing.json";
import SCRIPT_EXIT_REBLANCING_PORTFOLIO_ABI from "../constants/abis/scriptExitPortfolioRebalancing.json";
import GELATO_CORE_ABI from "../constants/abis/gelatoCore.json";

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
import { ethers } from "ethers";
import { useGelatoCore } from "../hooks/hooks";
import { CircularProgress } from "@material-ui/core";

// Gnosis CPK
import CPK from "contract-proxy-kit";

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

  let networkId: ChainIds;
  if (web3.active) networkId = web3.chainId as ChainIds;

  const DAI = "0xC4375B7De8af5a38a93548eb8453a498222C4fF2";

  const history = useHistory();

  const gelatoCore = useGelatoCore();

  const [currentIndex, setCurrentIndex] = React.useState(80);

  const [ethNum, setEthNum] = React.useState(ethers.constants.WeiPerEther);

  const [connectorModalOpen, setConnectorModalOpen] = React.useState(false);

  const [userIsInvested, setUserIsInvested] = React.useState(false);

  const [botIsActive, setBotIsActive] = React.useState(false);

  const [waiting, setWaiting] = React.useState(false);

  const [currentTotalPortfolio, setCurrentTotalPortfolio] = React.useState(
    ethers.constants.Zero
  );

  const [ethHoldings, setEthHoldings] = React.useState(ethers.constants.Zero);

  const [daiHoldings, setDaiHoldings] = React.useState(ethers.constants.Zero);

  // ON Mounting, set error to False

  // useEffect(() => {
  // 	// callFearGreedApi();
  // 	callGraphApi();
  // }, []);

  const getCpk = async () => {
    const cpk = await CPK.create({
      ethers,
      signer: web3.library.getSigner()
    });

    // const cpk2 = await CPK.create({
    //   ethers,
    //   signer: web3.library.getSigner(),
    //   networks: {
    //     42: {
    //       //  New Address
    //       proxyFactoryAddress: PAYABLE_FACTORY[networkId],
    //       //  Old Addreses
    //       masterCopyAddress: cpk.networks[networkId].masterCopyAddress,
    //       multiSendAddress: cpk.networks[networkId].multiSendAddress,
    //       fallbackHandlerAddress: cpk.networks[networkId].fallbackHandlerAddress
    //     }
    //   }
    // });

    const ownerAccount = await cpk.getOwnerAccount();

    // console.log(cpk2);
    // console.log(`Owner Account: ${ownerAccount}`);
    console.log(`Proxy Address: ${cpk.address}`);

    return cpk;
  };

  const sendEthToBotAddress = async (ethAmount: ethers.utils.BigNumber) => {
    setWaiting(true);
    const signer = web3.library.getSigner();
    const cpk = await getCpk();
    const proxyAddress = cpk.address;

    let tx = {
      to: proxyAddress,
      value: ethAmount
    };

    try {
      let txObject = await signer.sendTransaction(tx);

      web3.library.waitForTransaction(txObject.hash).then((receipt: any) => {
        console.log("Transaction Mined: " + receipt.hash);
        console.log(receipt);
        setWaiting(false);
        setUserIsInvested(true)
      });
    } catch (error) {
      console.log(error);
      setWaiting(false);
    }
  };

  const getContractInstance = (address: string, abi: any) => {
    const signer = web3.library.getSigner();
    const contractInstance = new ethers.Contract(address, abi, signer);
    return contractInstance;
  };

  const isActivated = async () => {
    const ScriptEnterContract = getContractInstance(
      SCRIPT_ENTER_PORTFOLIO_REBALANCING[networkId],
      SCRIPT_ENTER_REBLANCING_PORTFOLIO_ABI
    );

    const contractInterface = ScriptEnterContract.interface;

    const cpk = await getCpk();

    const eventName = "LogEntered";

    const filter = {
      address: cpk.address,
      topics: [contractInterface.events[eventName].topic],
      fromBlock: 0
    };

    const logs = await web3.library.getLogs(filter);

    const lastLog = logs[logs.length - 1];

    let blockNumberEnterScript = 0;
    if (lastLog) blockNumberEnterScript = lastLog.blockNumber;

    // ########### Exit script

    const ScriptExitContract = getContractInstance(
      SCRIPT_EXIT_PORTFOLIO_REBALANCING[networkId],
      SCRIPT_EXIT_REBLANCING_PORTFOLIO_ABI
    );

    const contractInterface2 = ScriptExitContract.interface;

    const eventName2 = "LogExit";

    const filter2 = {
      address: cpk.address,
      topics: [contractInterface2.events[eventName2].topic],
      fromBlock: 0
    };

    const logs2 = await web3.library.getLogs(filter2);

    const lastLog2 = logs2[logs2.length - 1];

    let blockNumberExitScript = 0;
    if (lastLog2) blockNumberExitScript = lastLog2.blockNumber;

    if (blockNumberEnterScript > blockNumberExitScript) {
      setBotIsActive(true);
      console.log("Bot is active");
    } else {
      setBotIsActive(false);
    }
  };

  const activateBot = async () => {
    const interFace = new ethers.utils.Interface(
      SCRIPT_ENTER_REBLANCING_PORTFOLIO_ABI
    );

    const gelatoCoreAddress = GELATO_CORE_ADDRESS[networkId];

    const enterPortfolioScriptPayload = interFace.functions.enterPortfolioRebalancing.encode(
      [
        gelatoCoreAddress,
        SELECTED_PROVIDER_AND_EXECUTOR[networkId],
        CONDITION_AND_ACTION[networkId]
      ]
    );

    const enterPortfolioScriptAddress =
      SCRIPT_ENTER_PORTFOLIO_REBALANCING[networkId];

    const success = await sendTx(enterPortfolioScriptAddress, enterPortfolioScriptPayload);
    if (success) {
      setBotIsActive(true)
    }

  };

  const fetchLastExecutionClaim = async () => {
    const gelatoCoreAddress = GELATO_CORE_ADDRESS[networkId];

    const ScriptEnterContract = getContractInstance(
      gelatoCoreAddress,
      GELATO_CORE_ABI
    );

    const contractInterface = ScriptEnterContract.interface;

    const eventName = "LogExecutionClaimMinted";

    const filter = {
      address: gelatoCoreAddress,
      topics: [contractInterface.events[eventName].topic],
      fromBlock: 0
    };

    let logs = await web3.library.getLogs(filter);

    const parsedLogs: Array<any> = [];
    logs.map((log: any) => {
      const parsedLog = contractInterface.parseLog(log);
      if (
        parsedLog.values.conditionAndAction[0] ===
          CONDITION_AND_ACTION[networkId][0] &&
        parsedLog.values.conditionAndAction[1] ===
          CONDITION_AND_ACTION[networkId][1]
      ) {
        parsedLogs.push(parsedLog);
      }
    });

    const lastLog = parsedLogs[parsedLogs.length - 1];
    return {
      selectedProviderAndExecutor: lastLog.values.selectedProviderAndExecutor,
      executionClaimId: lastLog.values.executionClaimId,
      conditionAndAction: lastLog.values.conditionAndAction,
      conditionPayload: lastLog.values.conditionPayload,
      actionPayload: lastLog.values.actionPayload,
      executionClaimExpiryDate: lastLog.values.executionClaimExpiryDate
    };
  };

  const deactivateBot = async () => {
    const txData = await fetchLastExecutionClaim();
    console.log(txData);

    const interFace = new ethers.utils.Interface(
      SCRIPT_EXIT_REBLANCING_PORTFOLIO_ABI
    );

    const withdrawAddress = web3.account;

    const inputs = [
      withdrawAddress,
      txData.selectedProviderAndExecutor,
      txData.executionClaimId,
      txData.conditionAndAction,
      txData.conditionPayload,
      txData.actionPayload,
      txData.executionClaimExpiryDate
    ];

    console.log(inputs);

    const exitPortfolioScriptPayload = interFace.functions.exitRebalancingPortfolio.encode(
      inputs
    );

    const exitPortfolioScriptAddress =
      SCRIPT_EXIT_PORTFOLIO_REBALANCING[networkId];

    const success = await sendTx(exitPortfolioScriptAddress, exitPortfolioScriptPayload);
    if (success) {

      setUserIsInvested(false)
      setBotIsActive(false)
    }
  };

  const sendTx = async (address: string, payload: any) => {
    setWaiting(true);

    const cpk = await getCpk();

    console.log("sending Tx");
    console.log(`
      To: ${address}
      Payload: ${payload}
  	`);

    try {
      const cpkResponse = await cpk.execTransactions(
        [
          {
            operation: CPK.DELEGATECALL,
            to: address,
            value: 0,
            data: payload
          }
        ],
        {
          gasLimit: 1000000
        }
      );
      console.log("Tx sent");
      console.log(`Hash: ${cpkResponse.hash}`);

      const ownerAccount = await cpk.getOwnerAccount();

      // If EOA is not a Gnosis Safe connected via Wallet Connect
      if (cpk.address !== ownerAccount) {
        if (cpkResponse.transactionResponse) {
          await cpkResponse.transactionResponse.wait();
          setWaiting(false);
          console.log("Tx mined");
        }
      }
      return true;
    } catch (error) {
      setWaiting(false);
      console.log(error);
      return false
    }
  };

  useEffect(() => {
    if (web3.active) {
      getCpk();
      isUserInvested();
      isActivated();
    }
  }, [web3.active, web3.account]);

  const isUserInvested = async () => {
    const address = web3.account as string;
    const provider = web3.library;
    const cpk = await getCpk();
    const proxyBalance = await provider.getBalance(
      ethers.utils.getAddress(cpk.address)
    );
    console.log(proxyBalance.toString())

    // Set User is invested to true if Proxy has some ETH balance
    if (proxyBalance.gt(ethers.constants.Zero)) {
      setUserIsInvested(true);
    } else {
      setUserIsInvested(false);
    }
  };

  const calculatePortfolioValue = async () => {
    if (web3.active && userIsInvested) {
      const cpk = await getCpk();
      const proxyAddress = cpk.address;

      // console.log(proxyAddress);

      const signer = web3.library.getSigner();
      const erc20 = new ethers.Contract(DAI, JSON.stringify(ERC20_ABI), signer);
      const decimalConverter = 100000000;
      const balance = await erc20.balanceOf(proxyAddress);

      if (!balance.eq(ethers.constants.Zero)) {
        if(!daiHoldings.eq(balance)) setDaiHoldings(balance);

        let humanReadableBalanceDai = convertWeiToHumanReadableForTokenAmount(
          balance,
          18
        );
        humanReadableBalanceDai = (
          Math.floor(parseFloat(humanReadableBalanceDai) * decimalConverter) /
          decimalConverter
        ).toFixed(8);
        // console.log(humanReadableBalanceDai);
      }
      const balanceEth = await web3.library.getBalance(proxyAddress);

      // console.log(balanceEth.toString());
      if (!balanceEth.eq(ethers.constants.Zero)) {
        if(!ethHoldings.eq(balanceEth)) setEthHoldings(balanceEth);

        let humanReadableBalanceEth = convertWeiToHumanReadableForTokenAmount(
          balanceEth,
          18
        );
        humanReadableBalanceEth = (
          Math.floor(parseFloat(humanReadableBalanceEth) * decimalConverter) /
          decimalConverter
        ).toFixed(8);
        // console.log(humanReadableBalanceEth);
        let ethInDai = await calculateUniswapPrice(signer, DAI, balanceEth);
        const totalDai = ethInDai.add(balance);
        if(!currentTotalPortfolio.eq(totalDai)) setCurrentTotalPortfolio(totalDai);
        // console.log(totalDai);
      }
    }
  };

  useEffect(() => {
    if(web3.active) calculatePortfolioValue();

  }, [daiHoldings, ethHoldings, currentTotalPortfolio, userIsInvested]);

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

        {userIsInvested && (
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
                  daiHoldings,
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
          {!userIsInvested && (
            <div>
              <EthInput
                userIsInvested={userIsInvested}
                ethNum={setEthNum}
                defaultValue={ethNum}
              ></EthInput>
            </div>
          )}
          <div>
            {web3.active && userIsInvested && !waiting && !botIsActive && (
              <Button
                onClick={async () => {
                  await activateBot();
                }}
                className={classes.createButton}
              >
                {`Activate Bot`}
              </Button>
            )}
            {web3.active && userIsInvested && !waiting && (
              <Button
                onClick={async () => {
                  await deactivateBot();
                }}
                className={classes.createButton}
              >
                {`${
                  botIsActive
                    ? "Withdraw portfolio in ETH & Deactivate Bot"
                    : "Withdraw ETH"
                }`}
              </Button>
            )}

            {web3.active && !userIsInvested && !waiting && (
              <Button
                onClick={async () => {
                  console.log("Invest");

                  // await activateBot();
                  await sendEthToBotAddress(ethNum);
                }}
                className={classes.createButton}
              >
                {`Fund your Bot`}
              </Button>
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

            {waiting && (
              <CircularProgress
                size={24}
                style={{ marginLeft: "16px" }}
                color={"primary"}
              />
            )}
          </div>
        </Grid>

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
            >{`*Every triggered rebalance inccurs a 0.3% fee`}</p>
          </div>
        </Grid>
        {/* <Grid
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
					</Grid> */}
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
