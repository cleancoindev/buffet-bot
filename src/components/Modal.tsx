import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Grid } from '@material-ui/core';
import TransactionCard from './TransactionCard';
import { TxState } from '../constants/interfaces';

interface TransactioModalProps {
	title: string;
	modalOpen: boolean;
	modalClose: () => void;
	modalClickOpen: () => void;
	txState: TxState;
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
	const { txState, title, modalOpen, modalClickOpen, modalClose } = props;

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
					></TransactionCard>
				</DialogContent>
			</Dialog>
		</div>
	);
}
