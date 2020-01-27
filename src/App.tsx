import React from 'react';
import './App.css';

// Router
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Pages
import Configurator from './pages/Configurator';
import Instruct from './pages/Instruct';
import Dashboard from './pages/Dashboard';

// Components
import Header from './components/Header';

// MUI components
import Container from '@material-ui/core/Container';

// CSS
import CssBaseline from '@material-ui/core/CssBaseline';

// Contexts
import GlobalStateProvider from './state/GlobalState';
import TransactionOverview from './pages/TransactionOverview';
import TransactionModal from './components/Modal';
import { COLOURS, BOX } from './constants/constants';
import { WarningMessage } from './components/WarningMessage';
import Footer from './components/Footer';

// APP Materiak THeme
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Help from './pages/Help';
import { Typography } from '@material-ui/core';
import { ErrorBoundary } from './components/ErrorBoundary';

const theme = createMuiTheme({
	typography: {
		// fontFamily: ['Ubuntu Mono'].join(',')
		fontFamily: ['Ubuntu Mono'].join(',')
	},
	palette: {
		primary: {
			main: COLOURS.salmon,
			contrastText: 'white'
		}
	}
});

function App() {
	return (
		<GlobalStateProvider>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				<Router>
					<div className="App">
						<div className="container">
							<Header></Header>
							<WarningMessage></WarningMessage>
							{/* <Typography
								style={{
									textAlign: 'center',
									marginTop: '48px'
								}}
								variant="h5"
								component="h5"
								gutterBottom
							>
								Give your gelato bot new instructions
							</Typography> */}
							<ErrorBoundary>
								<Container
									className={'sub-container'}
									style={{
										// marginTop: '48px',
										marginTop: '40px',
										padding: '0px'
									}}
								>
									<div>
										<Switch>
											<Route
												path="/"
												exact
												component={Configurator}
											/>
											<Route
												path="/dashboard"
												exact
												component={Dashboard}
											/>
											<Route
												path="/how-it-works"
												exact
												component={Help}
											/>
											<Route
												path="/dashboard/:transactionId"
												component={TransactionOverview}
											/>
											<Route
												path="/instruct/:conditionId/:actionId"
												component={Instruct}
											/>

											{/*Last route acts as an try catch*/}
											<Route
												path="/"
												component={Configurator}
											/>
										</Switch>
									</div>
								</Container>
							</ErrorBoundary>
							<Footer></Footer>
						</div>
						<TransactionModal></TransactionModal>
					</div>
				</Router>
			</ThemeProvider>
		</GlobalStateProvider>
	);
}

export default App;
