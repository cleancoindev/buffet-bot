import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%',
			'& > * + *': {
				marginTop: theme.spacing(2)
			}
		}
	})
);

export default function LinearDeterminate() {
	const classes = useStyles({});
	const [completed, setCompleted] = React.useState(1);

	React.useEffect(() => {
		function progress() {
			setCompleted(oldCompleted => {
				if (oldCompleted === 99) {
					return 99;
				}
				const diff = Math.random() * 9;
				return Math.min(oldCompleted + diff, 99);
			});
		}

		const timer = setInterval(progress, 800);
		return () => {
			clearInterval(timer);
		};
	}, [completed]);

	return (
		<div className={classes.root}>
			<LinearProgress variant="determinate" value={completed} />
		</div>
	);
}
