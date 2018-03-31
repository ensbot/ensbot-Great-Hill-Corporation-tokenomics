import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

import logo from './logo.svg';
import Chart from './Chart';
import Table from './Table';
import './App.css';

const Links = () => {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to={{pathname: '/tipjar'}}>Tip Jar</Link>
    </nav>
  )
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <Links />
            <Route exact path="/" component={Chart} />
            <Route path="/tipjar" render={() => <Table monitorAddress='0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359'/>} />
          </div>
        </Router>
        {/* <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get acclimated, edit <code>src/App.js</code> and save to reload.
        </p> */}

      </div>
    );
  }
}

export default App;
