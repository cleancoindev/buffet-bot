import React from 'react';
import {
	RESET_CONDITION,
	RESET_ACTION,
	INPUT_OK,
	COLOURS
} from '../constants/constants';
import { TxState } from '../constants/interfaces';
import { useIcedTxContext } from '../state/GlobalState';
import { useHistory } from 'react-router-dom';
import { withStyles, Button } from '@material-ui/core';

const MISSING_ERROR = 'Error was swallowed during propagation.';

const BootstrapButton = withStyles({
	root: {
		// minWidth: '150px',
		boxShadow: 'none',
		textTransform: 'none',
		fontSize: 16,
		padding: '6px 12px',
		// marginLeft: '16px',
		lineHeight: 1.5,
		border: '0.5px solid',
		borderColor: COLOURS.salmon,
		// borderRadius: '1px 1px 1px 1px',
		color: 'white',

		'&:hover': {
			backgroundColor: COLOURS.salmon50,
			borderColor: 'white',
			boxShadow: 'none'
		},
		'&:active': {
			boxShadow: 'none',
			backgroundColor: '#0062cc',
			borderColor: '#005cbf'
		}
		// '&:focus': {
		// 	boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)'
		// }
	}
})(Button);

export const withErrorBoundary = <BaseProps extends {}>(
	BaseComponent: React.ComponentType<BaseProps>
) => {
	type HocProps = {
		// here you can extend hoc with new props
	};
	type HocState = {
		readonly error: Error | null | undefined;
	};

	return class Hoc extends React.Component<HocProps, HocState> {
		// Enhance component name for debugging and React-Dev-Tools
		static displayName = `withErrorBoundary(${BaseComponent.name})`;
		// reference to original wrapped component
		static readonly WrappedComponent = BaseComponent;

		readonly state: HocState = {
			error: undefined
		};

		componentDidCatch(error: Error | null, info: object) {
			this.setState({ error: error || new Error(MISSING_ERROR) });
			this.logErrorToCloud(error, info);
		}

		logErrorToCloud = (error: Error | null, info: object) => {
			// TODO: send error report to service provider
		};

		render() {
			const { children, ...restProps } = this.props;
			const { error } = this.state;

			if (error) {
				return <BaseComponent {...(restProps as BaseProps)} />;
			}

			return children;
		}
	};
};

export const ErrorMessage: React.FC<{ onReset: () => void }> = ({
	onReset
}) => {
	const { dispatch } = useIcedTxContext();
	const history = useHistory();
	const linkBackToHome = () => {
		dispatch({ type: RESET_CONDITION });
		dispatch({ type: RESET_ACTION });
		dispatch({
			type: INPUT_OK,
			txState: TxState.displayLogIntoMetamask
		});
		history.push('/');
		window.location.reload();
	};
	return (
		<div style={{ color: 'white' }}>
			<h1>{`Sorry there was an unexpected error`}</h1>
			{`To continue: `}

			<BootstrapButton
				// style={{ border: 'none' }}
				onClick={linkBackToHome}
			>
				Press here
			</BootstrapButton>
		</div>
	);
};

export const ErrorBoundary = withErrorBoundary(ErrorMessage);
