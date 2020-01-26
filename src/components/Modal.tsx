import React from 'react';
// import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TransactionCard from './TransactionCard';
import { TxState, IcedTx } from '../constants/interfaces';
import { useIcedTxContext } from '../state/GlobalState';
import { OPEN_MODAL, CLOSE_MODAL, BOX } from '../constants/constants';

import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

// interface TransactioModalProps {
// 	modalOpen: boolean;
// 	modalClose: () => void;
// 	modalClickOpen: () => void;
// 	icedTxState: IcedTx;
// }

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			'& .MuiDialog-paperWidthMd': {
				minWidth: '40%'
			}
		}
	})
);

export default function TransactionModal() {
	const { icedTxState, dispatch } = useIcedTxContext();

	const txState = icedTxState.txState;

	const classes = useStyles();

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
				className={classes.root}
				// onClose={modalClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				// style={{ maxWidth: '100%' }}
				maxWidth={'md'}
				style={{ minWidth: '33vw' }}
			>
				{/* <DialogTitle id="alert-dialog-title">{title}</DialogTitle> */}
				<DialogContent
					style={{
						...BOX,
						backgroundColor: 'black'
						// minWidth: '33vw'
					}}
				>
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
