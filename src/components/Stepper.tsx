import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';

// Local Components
import StepperContent from './StepperContent';
import { StepperProps, TxState } from '../constants/interfaces';
import { COLOURS } from '../constants/constants';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%'
		},
		backButton: {
			background: 'grey',
			color: 'white',
			minWidth: '100px',
			border: 0,
			borderRadius: 3,
			boxShadow: '0 2px 2px 2px rgba(255, 255, 255, .3)',
			height: 48,
			padding: '0 30px',
			margin: 8,
			'&:hover': {
				background: '#4aedc4'
			}
		},
		nextButton: {
			background: COLOURS.salmon,
			minWidth: '100px',
			color: 'white',
			border: 0,
			borderRadius: 3,
			boxShadow: '0 2px 2px 2px rgba(255, 255, 255, .3)',
			height: 48,
			padding: '0 30px',
			margin: 8,
			'&:hover': {
				background: COLOURS.salmon60
			}
		},
		instructions: {
			marginTop: theme.spacing(1),
			marginBottom: theme.spacing(1)
		},
		stepper: {
			background: 'none',
			'& .MuiStepIcon-root.MuiStepIcon-active': {
				color: COLOURS.salmon
			}
		},
		title: {
			marginLeft: theme.spacing(3)
		},
		alternativeLabel: {
			color: 'white !important'
			// active: {
			// 	color: 'white'
			// },
			// completed: {
			// 	color: 'white'
			// }
		}
	})
);

export default function StepperParent(props: StepperProps) {
	const classes = useStyles({});
	const {
		icedTxState,
		steps,
		activeStep,
		handleNext,
		handleBack,
		// modalOpen,
		modalClickOpen
	} = props;

	return (
		<div className={classes.root}>
			<Stepper
				className={classes.stepper}
				style={{}}
				activeStep={activeStep}
				alternativeLabel
			>
				{steps.map(label => (
					<Step key={label}>
						<StepLabel
							classes={{
								alternativeLabel: classes.alternativeLabel
							}}
						>
							{label}
						</StepLabel>
					</Step>
				))}
			</Stepper>
			<div>
				{/* Content: LAST STEP */}
				{activeStep === steps.length ? (
					<div>
						{/* <TransactionCard txState={txState}></TransactionCard> */}
						<Button onClick={handleBack}>Back</Button>
					</div>
				) : (
					<div>
						{/* Steps before last */}
						{/* <Typography className={classes.instructions}> */}
						<StepperContent
							icedTxState={icedTxState}
							classes={classes}
							activeStep={activeStep}
							// {"@DEV WHAT DOES INPUTS DO?"}
							inputs={['uint256', 'uint256']}
						></StepperContent>
						{/* </Typography> */}
						<div style={{ marginBottom: '24px' }}>
							<Button
								disabled={activeStep === 0}
								onClick={handleBack}
								className={classes.backButton}
							>
								Back
							</Button>
							{activeStep === steps.length - 1 ? (
								<Button
									variant="contained"
									color="primary"
									onClick={modalClickOpen}
									className={classes.nextButton}
								>
									{'Confirm'}
								</Button>
							) : (
								<Button
									variant="contained"
									color="primary"
									onClick={handleNext}
									className={classes.nextButton}
								>
									{'Next'}
								</Button>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
