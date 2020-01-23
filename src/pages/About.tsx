import React from 'react';
import { Grid, Typography, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { BOX } from '../constants/constants';

const useStyles = makeStyles(theme => ({
	body: {
		marginBottom: '24px',
		textAlign: 'left'
	},
	header: {
		textAlign: 'left'
	}
}));

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
						style={{ marginBottom: '24px' }}
					>
						How it works
					</Typography>
					<Typography
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
						Ethereum. It enables you to select a trigger (e.g. price
						of ETH/DAI on Kyber), which when being activated
						executes a certain action (e.g. buy a short ETH position
						on Fulcrum),
					</Typography>
					<Divider
						variant="inset"
						style={{
							width: '100%',
							background: 'white',
							marginBottom: '24px',
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
						friend in 2 weeks. Simply select the trigger 'Time',
						choose a date 2 weeks from now, then select the action
						'Send Tokens' and choose to transfer 100 DAI. Gelato
						will monitor the time on your behalf and send the 100
						DAI from your wallet when the trigger activates in 2
						weeks.
					</Typography>
					<Divider
						variant="inset"
						style={{
							width: '100%',
							background: 'white',
							marginBottom: '24px',
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
							marginBottom: '24px',
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
						a transaction beforehand, you can always to that on your
						dashboard
					</Typography>
					<Divider
						variant="inset"
						style={{
							width: '100%',
							background: 'white',
							marginBottom: '24px',
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
						long as the trigger is not activated. Upon activation of
						your selected trigger, these tokens will be moved out of
						your wallet by your smart contract based gelato wallet
						(that only you control) to conduct the action you
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
							marginBottom: '24px',
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
							marginBottom: '24px',
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
							marginBottom: '24px',
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
						Can I add my own trigger and actions to gelato?
					</Typography>
					<Typography
						variant="body1"
						gutterBottom
						className={classes.body}
					>
						Yes you can! The gelato protocol is open and
						permissionless, everyone can simply write trigger and
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
					</Typography>
				</Grid>
			</Grid>
		</React.Fragment>
	);
}
