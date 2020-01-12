import React from 'react';

import AppSelection from '../components/AppSelection';

// import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

// function Alert(props: AlertProps) {
// 	return <MuiAlert elevation={6} variant="filled" {...props} />;
// }

export default function Configurator() {
	return (
		<React.Fragment>
			{/* <MuiAlert elevation={6} variant="filled"></MuiAlert> */}
			<AppSelection />
		</React.Fragment>
	);
}
