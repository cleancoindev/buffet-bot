import React from 'react';

import AppSelection from '../components/AppSelection';
import { WarningMessage } from '../components/WarningMessage';

export default function Configurator() {
	return (
		<React.Fragment>
			{/* <WarningMessage></WarningMessage> */}
			<AppSelection />
		</React.Fragment>
	);
}
