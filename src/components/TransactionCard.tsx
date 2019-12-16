import React from 'react';
import { Grid, CircularProgress, Button } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TxState } from '../constants/interfaces';
import ProgressBar from './ProgressBar';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		gridItem: {
			paddingLeft: '8px',
			paddingRight: '8px'
		},
		dollar: {
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'flex-end',
			alignItems: 'center',
			marginLeft: 'auto',
			h4: {
				margin: '0px'
			}
		}
	})
);

enum Progress {
	awaitingConfirmation,
	awaitingeMining,
	finished
}

interface ModalContent {
	title: string;
	progress: Progress;
	progressText: string;
	prepayment: boolean;
}

interface TxCardProps {
	txState: TxState;
}

/*
export enum TxState {
	preApprove,
	postApprove,
	preCreate,
	postCreate,
	Cancelled,
	InsufficientBalance
}
*/

export default function TransactionCard(props: TxCardProps) {
	const classes = useStyles();
	const { txState } = props;

	function returnModalContent(txState: TxState): ModalContent {
		switch (txState) {
			case TxState.preApprove:
				return {
					title: `Approve gelato to move your DAI`,
					progress: Progress.awaitingConfirmation,
					progressText: `Waiting for Metamask confirmation`,
					prepayment: false
				};
			case TxState.postApprove:
				return {
					title: `Waiting for approval Tx to be mined`,
					progress: Progress.awaitingeMining,
					progressText: `Waiting for transaction to be mined`,
					prepayment: false
				};
			default:
				return {
					title: `Approve gelato to move your DAI`,
					progress: Progress.awaitingConfirmation,
					progressText: `Waiting for Metamask confirmation`,
					prepayment: false
				};
		}
	}

	// Set default modal Content through txState (are we at approval, insufficient balance, or creation phase transaction wise)
	const [modalContent, setModalContent] = React.useState<ModalContent>(
		returnModalContent(txState)
	);

	return (
		<div>
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
				style={{
					width: '300px',
					borderStyle: 'solid',
					borderWidth: '2px'
				}}
			>
				<Grid
					className={classes.gridItem}
					container
					item
					sm={12}
					xs={12}
					direction="column"
					justify="flex-start"
					alignItems="flex-start"
					style={{
						background: '#000000',
						color: 'white'
					}}
				>
					<h3>{modalContent.title}</h3>
				</Grid>
				<Grid
					className={classes.gridItem}
					container
					item
					sm={12}
					xs={12}
					direction="row"
					justify="flex-start"
					alignItems="center"
					style={{
						background: '#FFFFFF',
						paddingTop: '8px',
						paddingBottom: '8px'
						// borderStyle: 'solid',
						// borderWidth: '2px'
					}}
				>
					<ProgressBar />
				</Grid>
				<Grid
					className={classes.gridItem}
					container
					item
					sm={12}
					xs={12}
					direction="row"
					justify="flex-start"
					alignItems="center"
					style={{
						background: '#FFFFFF',
						paddingTop: '8px',
						paddingBottom: '8px'
						// borderStyle: 'solid',
						// borderWidth: '2px'
					}}
				>
					<CircularProgress
						size={32}
						style={{ marginRight: '8px' }}
					/>
					<h4>{modalContent.progressText}</h4>
				</Grid>
				<Grid
					className={classes.gridItem}
					container
					item
					sm={12}
					xs={12}
					direction="row"
					justify="space-evenly"
					alignItems="flex-start"
					style={{
						background: '#E8E8E8'
					}}
				>
					<h4>Your Account</h4>
					<h4 style={{ marginLeft: 'auto' }}>0x232...fdf32</h4>
				</Grid>
				{modalContent.prepayment && (
					<Grid
						className={classes.gridItem}
						container
						item
						sm={12}
						xs={12}
						direction="row"
						justify="space-evenly"
						alignItems="center"
						style={{
							background: '#EEEEEE'
						}}
					>
						<h4>Gelato Prepayment</h4>
						<div className={classes.dollar}>
							<h4 style={{ margin: '0px' }}>0.025 ETH</h4>
							<p style={{ margin: '0px' }}>$3.25 USD</p>
						</div>
					</Grid>
				)}
				<Grid
					className={classes.gridItem}
					container
					item
					sm={12}
					xs={12}
					direction="row"
					justify="space-evenly"
					alignItems="center"
					style={{
						background: `${
							modalContent.prepayment ? '#E8E8E8' : '#EEEEEE'
						}`
					}}
				>
					<h4>Transaction Fee</h4>
					<div className={classes.dollar}>
						<h4 style={{ margin: '0px' }}>0.025 ETH</h4>
						<p style={{ margin: '0px' }}>$3.25 USD</p>
					</div>
				</Grid>
				<Grid
					className={classes.gridItem}
					container
					item
					sm={12}
					xs={12}
					direction="row"
					justify="space-evenly"
					alignItems="flex-start"
					style={{
						background: `${
							modalContent.prepayment ? '#EEEEEE' : '#E8E8E8'
						}`
					}}
				>
					<h4>Estimated Wait</h4>
					<h4 style={{ marginLeft: 'auto' }}>~ 1 minute remaining</h4>
				</Grid>
			</Grid>
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
				style={{
					width: '300px'
				}}
			>
				<Grid
					container
					item
					sm={12}
					xs={12}
					direction="row"
					justify="center"
					alignItems="center"
					style={{
						background: 'FFFFFF',
						marginTop: '24px'
					}}
				>
					<Button
						style={{
							width: '100%',
							borderStyle: 'solid',
							borderWidth: '2px'
						}}
					>
						Cancel
					</Button>
				</Grid>
			</Grid>
		</div>
	);
}
