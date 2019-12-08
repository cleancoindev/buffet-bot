import React from 'react';
import './App.css';

// Pages
import Configurator from './pages/Configurator'

// Components
import Header from './components/Header'

// CSS
import CssBaseline from '@material-ui/core/CssBaseline';



function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <div className="App">
        <Header></Header>
        <div className="container">
          <Configurator></Configurator>

        </div>
      </div>

    </React.Fragment>
  );
}

export default App;
