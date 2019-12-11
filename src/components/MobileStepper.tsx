import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import StepperContent from './StepperContent';
import { StepperProps } from '../constants/interfaces';

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },
});

export default function DotsMobileStepper(props: StepperProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { icedTxState, steps, activeStep, handleNext, handleBack, handleReset } = props


  return (
    <React.Fragment>
      <MobileStepper
        variant="dots"
        steps={3}
        position="static"
        activeStep={activeStep}
        className={classes.root}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === 3}>
            Next
            {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
            Back
          </Button>
        }
        />
        <div>
        <StepperContent icedTxState={icedTxState} classes={classes} activeStep={activeStep} inputs={["uint256","uint256"]}></StepperContent>
        </div>
      </React.Fragment>
  );
}