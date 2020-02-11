import React from 'react';
// import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TransactionCard from './TransactionCard';
import { TxState, IcedTx } from '../constants/interfaces';
import { useIcedTxContext, connectorsByName } from '../state/GlobalState';
import { OPEN_MODAL, CLOSE_MODAL, BOX, COLOURS } from '../constants/constants';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import { GelatoButton } from './Button';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { useWeb3React } from '@web3-react/core';

// interface TransactioModalProps {
// 	modalOpen: boolean;
// 	modalClose: () => void;
// 	modalClickOpen: () => void;
// 	icedTxState: IcedTx;
// }

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& .MuiDialog-paperWidthSm': {
				minWidth: '40%'
			}
		},
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

interface ConnectorModalProps {
	modalOpen: boolean;
	setModalOpen: Function;
}
export default function ConnectorModal(props: ConnectorModalProps) {
	const { icedTxState, dispatch } = useIcedTxContext();
	const { modalOpen, setModalOpen } = props;

	const txState = icedTxState.txState;

	const { activate } = useWeb3React();

	const classes = useStyles();

	const checkIfMetamaskInstalled = () => {
		let isInstalled = false;
		icedTxState.txState !== TxState.displayInstallMetamask
			? (isInstalled = true)
			: (isInstalled = false);
		return isInstalled;
	};

	// MODAL STUFF
	const modalClickOpen = () => {
		setModalOpen(true);
	};
	const modalClose = () => {
		setModalOpen(false);
	};

	const handleConnect = async (connector: AbstractConnector) => {
		await activate(connector, (error: Error) => {
			console.log(error);
		});
		modalClose();
	};

	return (
		<div>
			<Dialog
				open={modalOpen}
				className={classes.root}
				// onClose={modalClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				// style={{ maxWidth: '100%' }}
				maxWidth={'sm'}
			>
				{/* <DialogTitle id="alert-dialog-title">{title}</DialogTitle> */}
				<DialogContent
					style={{
						...BOX,
						backgroundColor: 'black'
						// minWidth: '33vw'
					}}
				>
					<div style={{ fontSize: '18' }}>
						<Grid
							container
							direction="column"
							justify="center"
							alignItems="center"
							style={{
								// width: '300px',
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
								{txState !== TxState.displayApprove && (
									<h3>
										Please log in to your preferred wallet
									</h3>
								)}
								{/* {txState === TxState.displayApprove && (
						<React.Fragment>
							<h3 style={{ marginBottom: '0px' }}>
								{modalContent.title}
							</h3>
							<p
								style={{
									textAlign: 'center',
									fontSize: '14px',
									marginTop: '8px'
								}}
							>
								(You won't have to wait for this transaction, it
								will confirm in the background)
							</p>
						</React.Fragment>
					)} */}
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
								<GelatoButton
									color="primary"
									style={{
										width: '100%',
										border: '0.5px solid',
										borderColor: COLOURS.salmon,
										// borderRadius: '1px 1px 1px 1px',
										color: 'white'
										// color: COLOURS.salmon
									}}
									onClick={() => {
										if (checkIfMetamaskInstalled()) {
											handleConnect(
												connectorsByName.Injected
											);
										} else {
											modalClose();
											// Open modal to show please install Metamask
											dispatch({
												type: OPEN_MODAL
											});
										}
									}}
								>
									<img
										style={{
											width: '24px',
											marginRight: '16px'
										}}
										src="/images/metamask_logo.svg"
									></img>
									Metamask
								</GelatoButton>
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
								<GelatoButton
									color="primary"
									style={{
										width: '100%',
										border: '0.5px solid',
										borderColor: COLOURS.salmon,
										// borderRadius: '1px 1px 1px 1px',
										color: 'white'
										// color: COLOURS.salmon
									}}
									onClick={() => {
										handleConnect(
											connectorsByName.WalletConnect
										);
									}}
								>
									<img
										style={{
											width: '24px',
											marginRight: '16px'
										}}
										src="/images/wallet_connect_logo.svg"
									></img>
									Wallet Connect
								</GelatoButton>
							</Grid>
							{/* Dont display close button for some of the modals*/}
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
									marginTop: '24px',
									marginBottom: '24px'
								}}
							>
								<GelatoButton
									color="primary"
									onClick={modalClose}
									style={{
										width: '100%',
										border: '0.5px solid',
										borderColor: COLOURS.salmon,
										// borderRadius: '1px 1px 1px 1px',
										color: 'white'
										// color: COLOURS.salmon
									}}
								>
									Close
								</GelatoButton>
							</Grid>
						</Grid>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
