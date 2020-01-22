import React from 'react';
import './App.css';

// Router
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

// Pages
import Configurator from './pages/Configurator';
import Create from './pages/Create';
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

const theme = createMuiTheme({
	typography: {
		fontFamily: ['PT Mono'].join(',')
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
							<Container
								className={'sub-container'}
								style={{
									// marginTop: '48px',
									marginTop: '32px',
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
											path="/create/:triggerId/:actionId"
											component={Create}
										/>

										{/*Last route acts as an try catch*/}
										<Route
											path="/"
											component={Configurator}
										/>
									</Switch>
								</div>
							</Container>
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
