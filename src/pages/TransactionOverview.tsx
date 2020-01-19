import React, { useEffect } from 'react';

// Types
import { RouteComponentProps, useHistory } from 'react-router-dom';

// Material UI
import Grid from '@material-ui/core/Grid';

// Types

import { useIcedTxContext } from '../state/GlobalState';
import TransactionSummary from '../components/TransactionSummary';
import {
	findTriggerByAddress,
	findActionByAddress,
	decodeTriggerPayload,
	decodeActionPayload
} from '../helpers/helpers';
import { on } from 'cluster';
import { render } from '@testing-library/react';
import { DEFAULT_PAST_TRANSACTIONS } from '../constants/constants';
import { useWeb3React } from '@web3-react/core';
import { ChainIds } from '../constants/interfaces';

interface TxOverviewParams {
	transactionId: string;
}

export default function TransactionOverview({
	match
}: RouteComponentProps<TxOverviewParams>) {
	// See if TxState.trigger.id === 0
	// IF so, check transactionId params, if it is a number, then fetch data from blockchain
	const {
		params: { transactionId }
	} = match;
	const { icedTxState } = useIcedTxContext();
	const web3 = useWeb3React();
	const history = useHistory();

	// Route to dashboard if no state is avaiable
	useEffect(() => {
		console.log('no state found');
		if (
			icedTxState.pastTransactions[0].expiryDate ===
			DEFAULT_PAST_TRANSACTIONS[0].expiryDate
		) {
			history.push('/dashboard');
		}
	}, []);

	// Get the identified past transaction from state
	const pastTransaction =
		icedTxState.pastTransactions[parseInt(transactionId.toString())];

	// Get respective triggers and action
	// console.log(pastTransaction.trigger);
	// console.log(pastTransaction.action);
	const trigger = findTriggerByAddress(
		pastTransaction.trigger,
		web3.chainId as ChainIds
	);
	const action = findActionByAddress(
		pastTransaction.action,
		web3.chainId as ChainIds
	);
	// Get user inputs by decoding payloads
	const triggerInputs = decodeTriggerPayload(
		pastTransaction.triggerPayload,
		trigger.params
	);

	const actionInputs = decodeActionPayload(
		pastTransaction.actionPayload,
		action.params
	);

	return (
		<React.Fragment>
			<Grid
				container
				direction="row"
				justify="center"
				alignItems="center"
			>
				<TransactionSummary
					trigger={trigger}
					action={action}
					triggerInputs={triggerInputs}
					actionInputs={actionInputs}
				></TransactionSummary>
			</Grid>
		</React.Fragment>
	);
}
