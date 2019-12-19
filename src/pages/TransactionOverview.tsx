import React, { MouseEvent, useState, useEffect } from 'react';

// Types
import { RouteComponentProps } from 'react-router-dom';

// Material UI
import Grid from '@material-ui/core/Grid';

// Types

import { useIcedTxContext } from '../state/GlobalState';
import TransactionSummary from '../components/TransactionSummary';
import {
	findConditionByAddress,
	findActionByAddress
} from '../helpers/helpers';

interface TxOverviewParams {
	transactionId: string;
}

export default function TransactionOverview({
	match
}: RouteComponentProps<TxOverviewParams>) {
	// See if TxState.condition.id === 0
	// IF so, check transactionId params, if it is a number, then fetch data from blockchain
	const {
		params: { transactionId }
	} = match;
	console.log(transactionId);
	const { icedTxState, dispatch } = useIcedTxContext();

	console.log(icedTxState.pastTransactions);

	// Get the identified past transaction from state
	const pastTransaction =
		icedTxState.pastTransactions[parseInt(transactionId.toString())];
	console.log(pastTransaction);

	// useEffect(()=> {
	// 	dispatch({

	// 	})
	// })

	return (
		<React.Fragment>
			<Grid
				container
				direction="row"
				justify="center"
				alignItems="center"
			>
				<TransactionSummary
					pastTransaction={pastTransaction}
				></TransactionSummary>
			</Grid>
		</React.Fragment>
	);
}
