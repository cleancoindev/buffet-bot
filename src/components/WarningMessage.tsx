import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { relative } from 'path';
import { COLOURS, BOX } from '../constants/constants';

const useStyles = makeStyles((theme: Theme) => ({
	warningMessage: {
		// ${({ theme }) => theme.flexRowNoWrap}
		// cursor: 'pointer',
		// flex: '1 0 auto',
		alignItems: 'center',
		position: 'relative',
		padding: '0.5rem 1rem',
		paddingRight: '2rem',
		// marginBottom: '16px',
		// marginTop: '48px',
		marginTop: '48px',
		border: `0.5px solid ${COLOURS.salmon}`,
		borderRadius: '1px 1px 1px 1px',
		// backgroundColor: COLOURS.salmon,
		// borderRadius: '1rem',
		fontSize: '0.95rem',
		lineHeight: '1rem',
		textAlign: 'center',
		overflow: 'visible',
		// textOverflow: 'ellipsis',
		whiteSpace: 'normal',
		color: 'white',

		'&:after': {
			content: "'✕'relative",
			top: '0.5remrelative',
			right: '1remrelative',
			position: 'absolute',
			color: 'white'
		}
	}
}));

export function WarningMessage() {
	const classes = useStyles();
	return (
		<div className={classes.warningMessage}>
			<span role="img" aria-label="warning">
				🚨
			</span>{' '}
			Caution! Alpha Version! Smart contracts are NOT audited. This is
			experimental tech. Use at own risk!
		</div>
	);
}
