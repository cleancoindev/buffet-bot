import React from 'react';

// Types
import { RouteComponentProps } from 'react-router-dom';

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

	// Get the identified past transaction from state
	const pastTransaction =
		icedTxState.pastTransactions[parseInt(transactionId.toString())];

	// Get respective triggers and action
	// console.log(pastTransaction.trigger);
	// console.log(pastTransaction.action);
	const trigger = findTriggerByAddress(pastTransaction.trigger);
	const action = findActionByAddress(pastTransaction.action);
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
