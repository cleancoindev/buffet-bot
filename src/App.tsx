import React from 'react';
import './App.css';

// Router
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

// Pages
import Configurator from './pages/Configurator'
import Create from './pages/Create'

// Components
import Header from './components/Header'

// MUI components
import Container from '@material-ui/core/Container';

// CSS
import CssBaseline from '@material-ui/core/CssBaseline';

// Contexts
import GlobalStateProvider from './state/GlobalState'


function App() {
  return (
    <GlobalStateProvider>
      <CssBaseline />
      <Router>
        <div className="App">
          <Header></Header>
          <div className="container">
            <Container style={{background: "white"}} maxWidth="lg">
              <Switch>
                <Route path="/" exact component={Configurator}/>
                <Route path="/create/:conditionId/:actionId" component={Create}/>

                {/*Last route acts as an try catch*/}
                <Route path="/" component={Configurator}/>
              </Switch>
            </Container>
          </div>
        </div>
      </Router>

    </GlobalStateProvider>
  );
}

export default App;
