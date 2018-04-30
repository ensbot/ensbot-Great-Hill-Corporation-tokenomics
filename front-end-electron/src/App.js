import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route} from 'react-router-dom';
import MonitorSelector from './MonitorSelector';
import MonitorView from './MonitorView/MonitorView';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <MonitorSelector />
            <Route exact path="/" />
            <Route path="/monitor/:monitorAddress" component={MonitorView} />
            </div>
        </Router>

      </div>
    );
  }
}

export default App;
