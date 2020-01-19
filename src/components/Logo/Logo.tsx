import React from 'react';
import { ReactComponent as Logo } from './gelato_logo.svg';
const GelatoLogo = () => (
	<div
		style={{
			width: '35px',
			marginRight: '8px'
		}}
	>
		{/* Logo is an actual React component */}
		<Logo />
	</div>
);

export default GelatoLogo;
