import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { classes } from 'istanbul-lib-coverage';

// Local Components
import StepperContent from './StepperContent';
import { StepperProps, TxState } from '../constants/interfaces';
import TransactionModal from './Modal';
import TransactionCard from './TransactionCard';

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			width: '100%'
		},
		backButton: {
			marginRight: theme.spacing(1)
		},
		instructions: {
			marginTop: theme.spacing(1),
			marginBottom: theme.spacing(1)
		},
		stepperContent: {
			background: 'black'
		},
		title: {
			marginLeft: theme.spacing(3)
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
		handleReset
	} = props;

	// Modal Stuff
	const [modalOpen, setModalOpen] = React.useState(true);

	const modalClickOpen = () => {
		setModalOpen(true);
	};

	const modalClose = () => {
		setModalOpen(false);
	};

	// Set TxState => Do dynamic
	const txState = TxState.postApprove;

	return (
		<div className={classes.root}>
			<Stepper activeStep={activeStep} alternativeLabel>
				{steps.map(label => (
					<Step key={label}>
						<StepLabel>{label}</StepLabel>
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
							inputs={['uint256', 'uint256']}
						></StepperContent>
						{/* </Typography> */}
						<div>
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
								>
									{'Confirm'}
								</Button>
							) : (
								<Button
									variant="contained"
									color="primary"
									onClick={handleNext}
								>
									{'Next'}
								</Button>
							)}
						</div>
					</div>
				)}
			</div>
			{/* <TransactionModal
				txState={txState}
				title={'Confirm in Metamask'}
				modalOpen={modalOpen}
				modalClickOpen={modalClickOpen}
				modalClose={modalClose}
			></TransactionModal> */}
		</div>
	);
}
