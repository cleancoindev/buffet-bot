import React from "react";
import "./App.css";

// Router
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// Pages
import Configurator from "./pages/Configurator";

// Components
import Header from "./components/Header";

// MUI components
import Container from "@material-ui/core/Container";

// CSS
import CssBaseline from "@material-ui/core/CssBaseline";

// Contexts
import GlobalStateProvider from "./state/GlobalState";

import { COLOURS, BOX } from "./constants/constants";
import Footer from "./components/Footer";

// APP Materiak THeme
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const theme = createMuiTheme({
	typography: {
		// fontFamily: ['Ubuntu Mono'].join(',')
		fontFamily: ["Ubuntu Mono"].join(",")
	},
	palette: {
		primary: {
			main: COLOURS.salmon,
			contrastText: "white"
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
							{/* <WarningMessage></WarningMessage> */}
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
							<Container
								className={"sub-container"}
								style={{
									// marginTop: '48px',
									marginTop: "40px",
									padding: "0px"
								}}
							>
								<div>
									<Switch>
										<Route path="/" exact component={Configurator} />
										{/*Last route acts as an try catch*/}
										<Route path="/" component={Configurator} />
									</Switch>
								</div>
							</Container>
							<Footer></Footer>
						</div>
					</div>
				</Router>
			</ThemeProvider>
		</GlobalStateProvider>
	);
}

export default App;
