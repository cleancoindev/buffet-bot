import React from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import TransactionTable from '../components/TransactionTable';
// Local Components

// Types

import { useIcedTxContext } from '../state/GlobalState';

// interface Match extends RouteComponentProps<Params> {}

export default function Create() {
	// const { icedTxState, dispatch } = useIcedTxContext();
	return (
		<React.Fragment>
			<Grid
				container
				direction="row"
				justify="center"
				alignItems="center"
			>
				<TransactionTable />
			</Grid>
		</React.Fragment>
	);
}
