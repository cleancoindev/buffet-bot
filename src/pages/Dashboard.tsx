import React from 'react';

// Material UI
import Grid from '@material-ui/core/Grid';
import TransactionTable from '../components/TransactionTable';
// Local Components

// Types

import { useIcedTxContext } from '../state/GlobalState';
import { COLOURS } from '../constants/constants';
import { Button } from '@material-ui/core';
import { useWeb3React } from '@web3-react/core';

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
				// style={{
				// 	border: `3px outset ${COLOURS.salmon}`,
				// 	borderRadius: '2px 2px 2px 2px',
				// 	background: 'white'
				// }}
			>
				<TransactionTable />
			</Grid>
		</React.Fragment>
	);
}
