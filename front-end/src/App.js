import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route} from 'react-router-dom';
import MonitorSelector from './MonitorSelector';
import MonitorView from './MonitorView/MonitorView';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      monitorGroups: [{addresses: []}],
      isLoaded: false,
      error: null,
    };
  }

  componentDidMount = () => {
    console.log('api: fetching monitor groups');
    fetch(`/api/v1/ui/monitor-groups`)
      .then(res => res.json())
      .then(
        (res) => {
          console.log(res);
          this.setState({
            monitorGroups: res.data.monitorGroups,
            isLoaded: true,
        })},
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          })
        });
    }

  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <MonitorSelector monitorGroups={this.state.monitorGroups}/>
            <Route exact path="/" />
            <Route path="/monitor/:monitorAddress" component={MonitorView} />
            </div>
        </Router>

      </div>
    );
  }
}

export default App;
