import React from 'react';
import { Grid, Typography, Divider } from '@material-ui/core';

import { BOX, COLOURS } from '../constants/constants';

import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%'
		},
		paperRoot: {
			background: 'transparent',
			// borderColor: COLOURS.salmon,
			color: 'white'
			// marginBottom: '32px'
			// borderWidth: 1
		},
		heading: {
			fontSize: '18px',
			fontWeight: theme.typography.fontWeightRegular,
			textAlign: 'left'
		},
		body: {
			marginBottom: '32px',
			fontSize: '18px',
			textAlign: 'left'
		},
		header: {
			textAlign: 'left'
		}
	})
);

export default function Help() {
	const classes = useStyles();
	return (
		<React.Fragment>
			<Grid
				container
				direction="column"
				justify="flex-start"
				alignItems="center"
				style={{
					...BOX,
					padding: '16px'
				}}
			>
				<Grid
					container
					item
					md={12}
					sm={12}
					xs={12}
					direction="column"
					justify="flex-start"
					alignItems="flex-start"
					// style={{ background: 'green' }}
				>
					<Typography
						variant="h4"
						component="h4"
						gutterBottom
						className={classes.header}
						style={{ marginBottom: '32px' }}
					>
						FAQs
					</Typography>
					<div className={classes.root}>
						{/* 1 */}
						<ExpansionPanel className={classes.paperRoot}>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<Typography className={classes.heading}>
									1. Is gelato 100% safe to use?
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Typography style={{ textAlign: 'left' }}>
									No. Use with caution and at own risk. Gelato
									is currently in alpha and its smart
									contracts are NOT AUDITED. Therefore, please
									treat this version as experimental tech and
									do NOT use it to transfer large amounts of
									funds. We are working on getting an audit
									done soon.
								</Typography>
							</ExpansionPanelDetails>
						</ExpansionPanel>
						{/* 1 */}
						<ExpansionPanel className={classes.paperRoot}>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<Typography className={classes.heading}>
									2. What is gelato?
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Typography style={{ textAlign: 'left' }}>
									Gelato is your personal Ethereum bot that
									will execute and automate transactions on
									your behalf, based on instructions and
									allowances prescribed by you.
								</Typography>
							</ExpansionPanelDetails>
						</ExpansionPanel>
						{/* 1 */}
						<ExpansionPanel className={classes.paperRoot}>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<Typography className={classes.heading}>
									3. How do I get my gelato bot?
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Typography style={{ textAlign: 'left' }}>
									All you need to do, in order to have your
									own Ethereum bot available to you, is to
									deploy it on gelato.finance. This is a
									one-time thing you have to do. You will be
									prompted to deploy your gelato bot at end of
									creating your first instruction.
								</Typography>
							</ExpansionPanelDetails>
						</ExpansionPanel>
						{/* 1 */}
						<ExpansionPanel className={classes.paperRoot}>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<Typography className={classes.heading}>
									4. What can I do with my gelato bot?
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Typography style={{ textAlign: 'left' }}>
									On the gelato.finance you can create
									Instructions for your bot. These
									Instructions consist of sets of two
									components: Conditions and Actions. A
									Condition specifies the thing that you want
									your bot to keep monitoring. For example,
									your account balance, blocktime, or the
									ETH/DAI price on Kyber Network. An Action is
									what your bot should do with funds from your
									wallet if, and only if, your specified
									Condition is satisfied. Say, for instance,
									buy some ETH on Kyber, if the ETH-DAI price
									dropped by 15%. Your bot will constantly
									check the network for your Conditions, and
									execute transactions, with your funds, in
									accordance with the instructions outlined in
									the action.
								</Typography>
							</ExpansionPanelDetails>
						</ExpansionPanel>
						<ExpansionPanel className={classes.paperRoot}>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<Typography className={classes.heading}>
									5. Why doesn't my bot execute, even though
									the condition is fulfilled?
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Typography style={{ textAlign: 'left' }}>
									There could be multiple reasons why this is
									the case, maybe even a bug on our side (this
									is an alpha after all). However, the most
									common cause is that even though the
									condition you specified is fullfilled, you
									have an insufficient token balance currently
									in your wallet, meaning that not enough
									funds are there for your bot to execute the
									action.
								</Typography>
							</ExpansionPanelDetails>
						</ExpansionPanel>
						<ExpansionPanel className={classes.paperRoot}>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<Typography className={classes.heading}>
									6. I got an execution failure, what should I
									do?
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Typography style={{ textAlign: 'left' }}>
									Please contact us via Twitter or Telegram.
								</Typography>
							</ExpansionPanelDetails>
						</ExpansionPanel>
						<ExpansionPanel className={classes.paperRoot}>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<Typography className={classes.heading}>
									7. Example 1: Time based token transfers
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Typography style={{ textAlign: 'left' }}>
									Let's say you would like to send 100 DAI
									tokens to a friend in 2 weeks time. Go to
									“New Instruction”. Select Condition “Time”
									and set it to 2 weeks from now. Then you
									select Action “Send Tokens” and set the
									amount to 100 DAI. Then you “Submit
									Instruction” to your bot. If you have not
									created a bot yet, you can do so now. After
									that, if you have not approved your bot to
									move the selected token for your, you will
									be prompted to do so. The final submission
									process actually means that you have to send
									an Ethereum tx to your bot, in order to
									notify it.
								</Typography>
							</ExpansionPanelDetails>
						</ExpansionPanel>
						<ExpansionPanel className={classes.paperRoot}>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<Typography className={classes.heading}>
									8. Example 2: If ETH/DAI price drops, go
									leverage long on ETH
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Typography style={{ textAlign: 'left' }}>
									Select the 'Price on Kyber' condition and
									the 'Buy Leverage Tokens on Fulcrum' action.
									Your bot will now monitor the ETH/DAI
									exchange rate on Kyber and if it drops to
									your specified rate, it will buy Long-ETH
									tokens on Fulcrum (or BzX to be precise) for
									you.
								</Typography>
							</ExpansionPanelDetails>
						</ExpansionPanel>
						<ExpansionPanel className={classes.paperRoot}>
							<ExpansionPanelSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls="panel1a-content"
								id="panel1a-header"
							>
								<Typography className={classes.heading}>
									9. How long are the Instructions that I give
									to my bot valid?
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails>
								<Typography style={{ textAlign: 'left' }}>
									At the moment, the maximum lifetime for your
									Instructions is 60 Days. After that, they
									expire. If you wish to cancel an Instruction
									beforehand, you can do so on the gelato web
									interface. Should you have paid any fees for
									submitting the Instruction to your bot,
									those fees will be refunded to your account
									during your cancellation. If your
									Instruction has expired, and you did not
									cancel, any Instruction submission fees will
									not be refunded to you.
								</Typography>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					</div>
					{/* <Typography
						className={classes.header}
						variant="h5"
						component="h5"
						gutterBottom
					>
						What is gelato?
					</Typography>
					<Typography
						variant="body1"
						gutterBottom
						className={classes.body}
					>
						Gelato is a tool to create conditional transactions on
						Ethereum. It enables you to select a condition (e.g.
						price of ETH/DAI on Kyber), which when being activated
						executes a certain action (e.g. buy a short ETH position
						on Fulcrum),
					</Typography>
					<Divider
						variant="inset"
						style={{
							width: '100%',
							background: 'white',
							marginBottom: '32px',
							marginLeft: '0px',
							marginRight: '0px'
						}}
					/>
					<Typography
						className={classes.header}
						variant="h5"
						component="h5"
						gutterBottom
					>
						An example what you can do with it:
					</Typography>
					<Typography
						variant="body1"
						gutterBottom
						className={classes.body}
					>
						Let's say you would like to send 100 DAI tokens to a
						friend in 2 weeks. Simply select the condition 'Time',
						choose a date 2 weeks from now, then select the action
						'Send Tokens' and choose to transfer 100 DAI. Gelato
						will monitor the time on your behalf and send the 100
						DAI from your wallet when the condition activates in 2
						weeks.
					</Typography> */}
					{/* <Divider
						variant="inset"
						style={{
							width: '100%',
							background: 'white',
							marginBottom: '32px',
							marginLeft: '0px',
							marginRight: '0px'
						}}
					/>
					<Typography
						className={classes.header}
						variant="h5"
						component="h5"
						gutterBottom
					>
						Why gelato?
					</Typography>
					<Typography
						variant="body1"
						gutterBottom
						className={classes.body}
					>
						Imagine you wanting to send tokens to a friend in 2
						weeks. However you wanted to go on vacations to the
						Bermudas, where you won't have access to your private
						keys which controll your funds. Rather than having to
						take everything with you on vacations, simply create a
						time-based Token Send transaction using gelato, which
						will transfer the tokens on your behalf in 2 weeks while
						you are out having fun. Gelato monitors changing market
						conditions and transacts on your behalf so you don't
						have to.
					</Typography>
					<Divider
						variant="inset"
						style={{
							width: '100%',
							background: 'white',
							marginBottom: '32px',
							marginLeft: '0px',
							marginRight: '0px'
						}}
					/>
					<Typography
						className={classes.header}
						variant="h5"
						component="h5"
						gutterBottom
					>
						How long are the conditional transactions that I created
						valid?
					</Typography>
					<Typography
						variant="body1"
						gutterBottom
						className={classes.body}
					>
						4 months. After that, they expire. If you wish to cancel
						a transaction beforehand, you can always do that on your
						dashboard
					</Typography>
					<Divider
						variant="inset"
						style={{
							width: '100%',
							background: 'white',
							marginBottom: '32px',
							marginLeft: '0px',
							marginRight: '0px'
						}}
					/>
					<Typography
						className={classes.header}
						variant="h5"
						component="h5"
						gutterBottom
					>
						Do I keep custody of my funds?
					</Typography>
					<Typography
						variant="body1"
						gutterBottom
						className={classes.body}
					>
						Yes, always. Your tokens will remain in your wallet as
						long as the condition is not activated. Upon activation
						of your selected condition, these tokens will be moved
						out of your wallet by your smart contract based gelato
						wallet (that only you control) to conduct the action you
						specified. If you for example defined that you want to
						sell 100 DAI to WETH on Kyber's exchange, then 100 DAI
						will be moved out of your wallet, swapped for WETH and
						immediately send back to your wallet, all in one
						transaction.
					</Typography>
					<Divider
						variant="inset"
						style={{
							width: '100%',
							background: 'white',
							marginBottom: '32px',
							marginLeft: '0px',
							marginRight: '0px'
						}}
					/>
					<Typography
						className={classes.header}
						variant="h5"
						component="h5"
						gutterBottom
					>
						What is a gelato smart contract wallet and why do I need
						one?
					</Typography>
					<Typography
						variant="body1"
						gutterBottom
						className={classes.body}
					>
						Think of your gelato smart contract wallet as your user
						account, with the difference being that you have full
						control over it. Your funds will remain in your
						'regular' wallet (Metamask, Ledger, Trezor, Gnosis Safe)
						and will NOT be stored in your gelato wallet. What we
						ask you to do is to approve your gelato wallet to move
						funds in and out of your regular wallet when the
						conditional transactions you created get executed. You
						might not be online to conduct a transaction, but your
						gelato wallet, being a smart contract, is always online
						and ready to transact on your behalf.
					</Typography>
					<Divider
						variant="inset"
						style={{
							width: '100%',
							background: 'white',
							marginBottom: '32px',
							marginLeft: '0px',
							marginRight: '0px'
						}}
					/>
					<Typography
						className={classes.header}
						variant="h5"
						component="h5"
						gutterBottom
					>
						Has it been audited?
					</Typography>
					<Typography
						variant="body1"
						gutterBottom
						className={classes.body}
					>
						No. As mentioned above, gelato is currently in alpha and
						its smart contrats are NOT AUTIDED. Therefore please
						treat this version as experimental tech and do use it to
						transfer large amounts. We are working on getting an
						audit done soon.
					</Typography>
					<Divider
						variant="inset"
						style={{
							width: '100%',
							background: 'white',
							marginBottom: '32px',
							marginLeft: '0px',
							marginRight: '0px'
						}}
					/>
					<Typography
						className={classes.header}
						variant="h5"
						component="h5"
						gutterBottom
					>
						Can I add my own condition and actions to gelato?
					</Typography>
					<Typography
						variant="body1"
						gutterBottom
						className={classes.body}
					>
						Yes you can! The gelato protocol is open and
						permissionless, everyone can simply write condition and
						action smart contracts and offer cool new combinations
						to their users. If you have questions related to that,
						feel free to reach out via our{' '}
						<a
							style={{ color: 'white' }}
							href="https://t.me/joinchat/HbZmeE1JoKF92g_idVz6nA"
							target="_blank"
						>
							Telegram channel
						</a>
					</Typography> */}
				</Grid>
			</Grid>
		</React.Fragment>
	);
}

/*
export default function SimpleExpansionPanel() {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<ExpansionPanel>
				<ExpansionPanelSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel1a-content"
					id="panel1a-header"
				>
					<Typography className={classes.heading}>
						Expansion Panel 1
					</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Typography>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Suspendisse malesuada lacus ex, sit amet blandit leo
						lobortis eget.
					</Typography>
				</ExpansionPanelDetails>
			</ExpansionPanel>
			<ExpansionPanel>
				<ExpansionPanelSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel2a-content"
					id="panel2a-header"
				>
					<Typography className={classes.heading}>
						Expansion Panel 2
					</Typography>
				</ExpansionPanelSummary>
				<ExpansionPanelDetails>
					<Typography>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit.
						Suspendisse malesuada lacus ex, sit amet blandit leo
						lobortis eget.
					</Typography>
				</ExpansionPanelDetails>
			</ExpansionPanel>
			<ExpansionPanel disabled>
				<ExpansionPanelSummary
					expandIcon={<ExpandMoreIcon />}
					aria-controls="panel3a-content"
					id="panel3a-header"
				>
					<Typography className={classes.heading}>
						Disabled Expansion Panel
					</Typography>
				</ExpansionPanelSummary>
			</ExpansionPanel>
		</div>
	);
}
*/
