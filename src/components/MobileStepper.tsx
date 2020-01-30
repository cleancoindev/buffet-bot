import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import StepperContent from './StepperContent';
import { StepperProps } from '../constants/interfaces';
import { useIcedTxContext } from '../state/GlobalState';
import { OPEN_MODAL, COLOURS } from '../constants/constants';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../constants/connectors';

const useStyles = makeStyles({
	root: {
		maxWidth: 400,
		flexGrow: 1,
		backgroundColor: 'transparent',
		color: 'white',
		'& .MuiMobileStepper-dot': {
			backgroundColor: 'white'
		},
		'& .MuiMobileStepper-dotActive': {
			backgroundColor: COLOURS.salmon
		}
	}
});

export default function DotsMobileStepper(props: StepperProps) {
	const classes = useStyles();
	const theme = useTheme();
	const {
		activeStep,
		handleNext,
		handleBack,
		steps,
		findTokenBalance
	} = props;
	const { dispatch, icedTxState } = useIcedTxContext();
	const { active, activate } = useWeb3React();

	const NextButton = () => {
		if (activeStep === steps.length - 1) {
			return (
				<Button
					variant="contained"
					color="primary"
					size="small"
					style={{ backgroundColor: COLOURS.salmon, color: 'white' }}
					onClick={() => {
						// @ DEV should need that, but in order to display create right away, we dont do it
						// dispatch({
						// 	type: UPDATE_TX_STATE,
						// 	txState:
						// 		TxState.displayInstallMetamask
						// });
						dispatch({ type: OPEN_MODAL });
					}}
				>
					{'Confirm'}
				</Button>
			);
		} else {
			if (active) {
				return (
					<Button
						variant="contained"
						// color="primary"
						style={{
							backgroundColor: COLOURS.salmon,
							color: 'white'
						}}
						onClick={handleNext}
						size="small"
					>
						Next
						{theme.direction === 'rtl' ? (
							<KeyboardArrowLeft />
						) : (
							<KeyboardArrowRight />
						)}
					</Button>
				);
			} else {
				return (
					<Button
						variant="contained"
						// color="primary"
						style={{
							backgroundColor: COLOURS.salmon,
							color: 'white'
						}}
						onClick={async () => {
							await activate(injected);
						}}
						size="small"
					>
						Log in
						{theme.direction === 'rtl' ? (
							<KeyboardArrowLeft />
						) : (
							<KeyboardArrowRight />
						)}
					</Button>
				);
			}
		}
	};

	return (
		<React.Fragment>
			<MobileStepper
				variant="dots"
				steps={3}
				position="static"
				activeStep={activeStep}
				className={classes.root}
				nextButton={
					<NextButton></NextButton>
					// <Button
					// 	size="small"
					// 	onClick={handleNext}
					// 	disabled={activeStep === 3}
					// >
					// 	Next
					// 	{theme.direction === 'rtl' ? (
					// 		<KeyboardArrowLeft />
					// 	) : (
					// 		<KeyboardArrowRight />
					// 	)}
					// </Button>
				}
				backButton={
					<Button
						size="small"
						onClick={handleBack}
						disabled={activeStep === 0}
						style={{
							backgroundColor: 'transparent',
							color: 'white'
						}}
					>
						{theme.direction === 'rtl' ? (
							<KeyboardArrowRight />
						) : (
							<KeyboardArrowLeft />
						)}
						Back
					</Button>
				}
			/>
			<div style={{ width: '100%' }}>
				<StepperContent
					findTokenBalance={findTokenBalance}
					icedTxState={icedTxState}
					classes={classes}
					activeStep={activeStep}
				></StepperContent>
			</div>
		</React.Fragment>
	);
}
