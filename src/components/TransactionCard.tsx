import React, { useContext, useEffect } from 'react';
import { Grid, CircularProgress, Button } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { TxState, IcedTx } from '../constants/interfaces';
import ProgressBar from './ProgressBar';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import LinkIcon from '@material-ui/icons/Link';
import { useIcedTxContext } from '../state/GlobalState';
import { UPDATE_TX_STATE } from '../constants/constants';

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
	awaitingModalConfirm,
	awaitingMetamaskConfirm,
	awaitingeMining,
	finished,
	cancelled
}

interface ModalContent {
	title: string;
	progress: Progress;
	progressText: string;
	prepayment: boolean;
	btn: string;
}

interface TxCardProps {
	txState: TxState;
	modalOpen: boolean;
	modalClickOpen: () => void;
	modalClose: () => void;
	icedTxState: IcedTx;
}

/*
export enum TxState {
    preApprove,
    waitingApprove,
	postApprove,
    preCreate,
    waitingCreate,
	postCreate,
	Cancelled,
	InsufficientBalance
}
*/

export default function TransactionCard(props: TxCardProps) {
	const classes = useStyles();
	const {
		icedTxState,
		txState,
		modalOpen,
		modalClickOpen,
		modalClose
	} = props;
	console.log(txState);

	// Get icedTx context
	const { dispatch } = useIcedTxContext();

	function returnModalContent(txState: TxState): ModalContent {
		switch (txState) {
			case TxState.displayApprove:
				return {
					title: `Please approve gelato to move DAI for you`,
					progress: Progress.awaitingModalConfirm,
					progressText: ``,
					prepayment: false,
					btn: 'Approve'
				};
			case TxState.preApprove:
				return {
					title: `Please approve gelato to move DAI for you`,
					progress: Progress.awaitingMetamaskConfirm,
					progressText: `Waiting for Metamask confirmation`,
					prepayment: false,
					btn: ''
				};
			case TxState.displayCreate:
				return {
					title: `Create your Frozen Transaction`,
					progress: Progress.awaitingModalConfirm,
					progressText: ``,
					prepayment: true,
					btn: 'Create'
				};
			case TxState.preCreate:
				return {
					title: `Create your Frozen Transaction`,
					progress: Progress.awaitingMetamaskConfirm,
					progressText: `Waiting for Metamask confirmation`,
					prepayment: true,
					btn: ''
				};
			case TxState.waitingCreate:
				return {
					title: `Creating Frozen Transaction ...`,
					progress: Progress.awaitingeMining,
					progressText: `Transaction in progress`,
					prepayment: true,
					btn: ''
				};
			case TxState.postCreate:
				return {
					title: `Success: Frozen Transaction created!`,
					progress: Progress.finished,
					progressText: `Transaction mined`,
					prepayment: true,
					btn: 'Close'
				};
			case TxState.cancelled:
				return {
					title: `Transaction Cancelled`,
					progress: Progress.cancelled,
					progressText: `Tx cancelled`,
					prepayment: false,
					btn: 'Close'
				};
			default:
				return {
					title: `DEFAULT VALUE`,
					progress: Progress.awaitingMetamaskConfirm,
					progressText: `Waiting for Metamask confirmation`,
					prepayment: false,
					btn: ''
				};
		}
	}

	const incrementTxState = () => {
		modalClose();
		dispatch({
			type: UPDATE_TX_STATE,
			txState: txState + 1
		});
		modalClickOpen();
	};

	// Set default modal Content through txState (are we at approval, insufficient balance, or creation phase transaction wise)
	const [modalContent, setModalContent] = React.useState<ModalContent>(
		returnModalContent(txState)
	);

	// On every render, update the modals content
	useEffect(() => {
		setModalContent(returnModalContent(txState));
	}, [txState]);

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
					alignItems="center"
					style={{
						background: '#000000',
						color: 'white',
						textAlign: 'center'
					}}
				>
					<h3>{modalContent.title}</h3>
				</Grid>
				{/* {modalContent.progress === Progress.awaitingeMining && (
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
				)} */}

				{modalContent.progress !== Progress.awaitingModalConfirm && (
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
						{modalContent.progress ===
							Progress.awaitingMetamaskConfirm && (
							<CircularProgress
								size={32}
								style={{ marginRight: '8px' }}
							/>
						)}
						{modalContent.progress === Progress.finished && (
							<CheckCircleIcon
								color={'primary'}
								fontSize={'large'}
								style={{ marginRight: '8px' }}
							/>
						)}
						{modalContent.progress === Progress.cancelled && (
							<CancelIcon
								color={'primary'}
								fontSize={'large'}
								style={{ marginRight: '8px' }}
							/>
						)}

						{modalContent.progress === Progress.awaitingeMining && (
							// <React.Fragment>
							// <ProgressBar />
							<CircularProgress
								size={32}
								style={{ marginRight: '8px' }}
							/>
							// </React.Fragment>
						)}
						<h4>{modalContent.progressText}</h4>
					</Grid>
				)}
				{txState !== TxState.cancelled && (
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
				)}
				{txState === TxState.postCreate && (
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
						<h4>Activation Recipt</h4>
						<a
							style={{
								display: 'flex',
								alignItems: 'center',
								marginLeft: 'auto'
							}}
							href="https://www.etherscan.com"
							target="_blank"
						>
							<LinkIcon
								color={'primary'}
								fontSize={'large'}
								// style={{ marginRight: '8px' }}
							/>
						</a>
						{/* <h4 style={{ marginLeft: 'auto' }}>0x232...fdf32</h4> */}
					</Grid>
				)}
				{modalContent.prepayment &&
					txState !== TxState.postCreate &&
					txState !== TxState.cancelled && (
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
				{txState !== TxState.postCreate &&
					txState !== TxState.cancelled && (
						<React.Fragment>
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
										modalContent.prepayment
											? '#E8E8E8'
											: '#EEEEEE'
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
										modalContent.prepayment
											? '#EEEEEE'
											: '#E8E8E8'
									}`
								}}
							>
								<h4>Estimated Wait</h4>
								<h4 style={{ marginLeft: 'auto' }}>
									~ 1 minute
								</h4>
								{/* <h4 style={{ marginLeft: 'auto' }}>~ 1 minute remaining</h4> */}
							</Grid>
						</React.Fragment>
					)}
			</Grid>
			<Grid
				container
				direction="column"
				justify="center"
				alignItems="center"
				style={{
					marginTop: '24px',
					width: '300px',
					marginBottom: '16px'
					// borderStyle: 'solid',
					// borderWidth: '2px'
				}}
			>
				{txState === TxState.postCreate && (
					<React.Fragment>
						<Grid
							container
							item
							sm={12}
							xs={12}
							direction="row"
							justify="center"
							alignItems="center"
							style={{
								background: '#000000',
								color: 'white',
								margin: '0px',
								padding: '16px',
								textAlign: 'center'
							}}
						>
							<h3 style={{ margin: '0px' }}>
								What will happen now?
							</h3>
						</Grid>
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
								textAlign: 'center',
								padding: '16px',
								borderStyle: 'solid',
								borderWidth: '2px'
							}}
						>
							<h4 style={{ margin: '0px' }}>
								If the{' '}
								<span style={{ color: 'red' }}>
									{icedTxState.condition.title}
								</span>{' '}
								condition you chose is triggered, gelato will{' '}
								<span style={{ color: 'red' }}>
									{icedTxState.action.title}
								</span>{' '}
								on{' '}
								<span style={{ color: 'red' }}>
									{icedTxState.action.app}
								</span>{' '}
								on your behalf
							</h4>
						</Grid>
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
								Share your Configuration
							</Button>
						</Grid>
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
								margin: '0px'
							}}
						>
							<h3
								style={{
									margin: '8px'
								}}
							>
								or
							</h3>
						</Grid>
						<Grid
							container
							item
							sm={12}
							xs={12}
							direction="row"
							justify="center"
							alignItems="center"
							style={{
								background: 'FFFFFF'
							}}
						>
							<Button
								style={{
									width: '100%',
									borderStyle: 'solid',
									borderWidth: '2px'
								}}
							>
								View Frozen Transactions
							</Button>
						</Grid>
					</React.Fragment>
				)}
				{txState !== TxState.postCreate && modalContent.btn !== '' && (
					<Grid
						container
						item
						sm={12}
						xs={12}
						direction="row"
						justify="center"
						alignItems="center"
						style={{
							background: 'FFFFFF'
							// marginTop: '24px'
						}}
					>
						<Button
							style={{
								width: '100%',
								borderStyle: 'solid',
								borderWidth: '2px'
							}}
						>
							{modalContent.btn}
						</Button>
					</Grid>
				)}
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
						onClick={incrementTxState}
						style={{
							width: '100%',
							borderStyle: 'solid',
							borderWidth: '2px'
						}}
					>
						Dummy
					</Button>
				</Grid>
			</Grid>
		</div>
	);
}
