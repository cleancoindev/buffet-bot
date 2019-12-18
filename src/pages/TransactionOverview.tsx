import React, { MouseEvent, useState, useEffect } from 'react';

// Types
import { RouteComponentProps } from 'react-router-dom';

// Material UI
import Grid from '@material-ui/core/Grid';

// Types

import { useIcedTxContext } from '../state/GlobalState';

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
	const { icedTxState, dispatch } = useIcedTxContext();

	return (
		<React.Fragment>
			<Grid
				container
				direction="row"
				justify="center"
				alignItems="center"
			></Grid>
		</React.Fragment>
	);
}
