import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TransactionCard from './TransactionCard';
import { TxState, IcedTx } from '../constants/interfaces';

interface TransactioModalProps {
	title: string;
	modalOpen: boolean;
	modalClose: () => void;
	modalClickOpen: () => void;
	txState: TxState;
	icedTxState: IcedTx;
}

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		card: {
			width: '50%',
			height: '50%',
			background: 'white'
		}
	})
);

export default function TransactionModal(props: TransactioModalProps) {
	const classes = useStyles();
	const {
		icedTxState,
		txState,
		title,
		modalOpen,
		modalClickOpen,
		modalClose
	} = props;

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
