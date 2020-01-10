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

function App() {
	return (
		<GlobalStateProvider>
			<CssBaseline />
			<Router>
				<div className="App">
					<Header></Header>
					<div className="container">
						<Container
							// style={{ background: 'white' }}
							maxWidth="lg"
						>
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
									path="/dashboard/:transactionId"
									component={TransactionOverview}
								/>
								<Route
									path="/create/:triggerId/:actionId"
									component={Create}
								/>

								{/*Last route acts as an try catch*/}
								<Route path="/" component={Configurator} />
							</Switch>
						</Container>
					</div>
					<TransactionModal></TransactionModal>
				</div>
			</Router>
		</GlobalStateProvider>
	);
}

export default App;
