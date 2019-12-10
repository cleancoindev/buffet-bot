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



function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Router>
        <div className="App">
          <Header></Header>
          <div className="container">
            <Container style={{background: "white"}} maxWidth="lg">
              <Switch>
                <Route path="/" exact component={Configurator}/>
                <Route path="/create/:condition/:action" component={Create}/>

                {/*Last route acts as an try catch*/}
                <Route path="/" component={Configurator}/>
              </Switch>
            </Container>

          </div>
        </div>
      </Router>

    </React.Fragment>
  );
}

export default App;
