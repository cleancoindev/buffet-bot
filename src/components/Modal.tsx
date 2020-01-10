import React from 'react';
// import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TransactionCard from './TransactionCard';
import { TxState, IcedTx } from '../constants/interfaces';
import { useIcedTxContext } from '../state/GlobalState';
import { OPEN_MODAL, CLOSE_MODAL } from '../constants/constants';

// interface TransactioModalProps {
// 	modalOpen: boolean;
// 	modalClose: () => void;
// 	modalClickOpen: () => void;
// 	icedTxState: IcedTx;
// }

// const useStyles = makeStyles((theme: Theme) =>
// 	createStyles({
// 		card: {
// 			width: '50%',
// 			height: '50%',
// 			background: 'white'
// 		}
// 	})
// );

export default function TransactionModal() {
	const { icedTxState, dispatch } = useIcedTxContext();

	const txState = icedTxState.txState;

	// MODAL STUFF
	const modalOpen = icedTxState.modalOpen;
	const modalClickOpen = () => {
		console.log('setting modal to true');
		dispatch({ type: OPEN_MODAL });
		console.log(modalOpen);
	};
	const modalClose = () => {
		dispatch({ type: CLOSE_MODAL });
	};

	return (
		<div>
			<Dialog
				open={modalOpen}
				// onClose={modalClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				{/* <DialogTitle id="alert-dialog-title">{title}</DialogTitle> */}
				<DialogContent>
					<TransactionCard
						modalOpen={modalOpen}
						modalClose={modalClose}
						modalClickOpen={modalClickOpen}
						txState={txState}
						icedTxState={icedTxState}
					></TransactionCard>
				</DialogContent>
			</Dialog>
		</div>
	);
}
