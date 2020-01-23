import React from 'react';
import TwitterIcon from '@material-ui/icons/Twitter';
import GitHubIcon from '@material-ui/icons/GitHub';
import TelegramIcon from '@material-ui/icons/Telegram';
import '../App.css';
import { COLOURS } from '../constants/constants';

// use Style
// '&:hover': {color: COLOURS.salmon}

const Footer = () => {
	return (
		<div
			style={{
				color: 'white',
				// background: 'green',
				flexShrink: 0,
				display: 'flex',
				flexDirection: 'row',
				alignItems: 'center',
				marginTop: '32px',
				marginBottom: '32px'
			}}
		>
			<a href={'https://twitter.com/gelatofinance'} target="_blank">
				<TwitterIcon
					style={{ marginRight: '8px', color: 'white' }}
					fontSize="small"
				></TwitterIcon>
			</a>
			<a href={'https://github.com/gelatodigital'} target="_blank">
				<GitHubIcon
					style={{ marginRight: '8px', color: 'white' }}
					fontSize="small"
				></GitHubIcon>
			</a>
			<a
				href={'https://t.me/joinchat/HcTaOxJ0_FjU-r34vbvK8A'}
				target="_blank"
			>
				<TelegramIcon
					style={{ marginRight: '8px', color: 'white' }}
					fontSize="small"
				></TelegramIcon>
			</a>
			<div
				style={{
					marginLeft: 'auto',
					fontSize: '0.75rem',
					color: 'white',
					textAlign: 'center'
				}}
			>
				{' '}
				Supported by:{' '}
				{/* <span style={{ fontSize: '0.9rem', color: COLOURS.salmon }}> */}
				Gnosis GECO
				{/* </span> */}
				{' & '}
				{/* <span style={{ fontSize: '0.9rem', color: COLOURS.salmon }}> */}
				Meta Cartel
				{/* </span> */}
			</div>
		</div>
	);
};

export default Footer;
