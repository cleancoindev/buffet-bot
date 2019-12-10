import React from 'react'

// Material UI
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

// Local Components
import Stepper from '../components/Stepper'
import MobileStepper from '../components/MobileStepper'

// Types
import { RouteComponentProps } from 'react-router-dom';

interface MatchParams {
    name: string;
}

interface StepperProps {
    app: string;
    title: string;
    inputs: Array<string>;
    // Stepper details
    activeSteps: number;
    handleNext: Function;
    handleBack: Function;

}

interface MatchProps extends RouteComponentProps<MatchParams> {}


export default function Create({match}: MatchProps) {
    // console.log(match)

    // Stepper State
	const [activeStep, setActiveStep] = React.useState(0);
	// const steps = getSteps();

    // Stepper Functions
	const handleNext = () => {
		setActiveStep(prevActiveStep => prevActiveStep + 1);
	};

	const handleBack = () => {
		setActiveStep(prevActiveStep => prevActiveStep - 1);
	};

	const handleReset = () => {
		setActiveStep(0);
    };

    return (
        <React.Fragment>
            <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
            >
                <Hidden xsDown>
                    <Stepper></Stepper>

                </Hidden>
                <Hidden smUp>
                    <MobileStepper></MobileStepper>
                </Hidden>
            </Grid>


        </React.Fragment>



    )
}