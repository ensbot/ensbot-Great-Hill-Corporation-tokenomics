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
      monitorGroups: [],
      activeMonitor: {groupName: 'None', monitorName: 'test', monitorAddress: '0xf030laf'},
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

  handleMonitorSelection = (monitorSelection) => {
    //console.log(groupInfo.monitorGroupID);
    //console.log(this.state.monitorGroups);
    let group = this.state.monitorGroups.find((group) => group.monitorGroupID == monitorSelection.monitorGroupID);
    let monitor;
    if(monitorSelection.monitorAddress === undefined) {
      monitor = {
        monitorName: `All Addresses (${group.addresses.length})`,
        monitorAddress: null
      };
    } else {
      monitor = group.addresses.find((monitor) => monitor.monitorAddress == monitorSelection.monitorAddress);
    }
    console.log(monitorSelection.monitorAddress);
    this.setState({
       activeMonitor: {
         groupName: group.groupName,
         monitorName: monitor.monitorName,
         monitorAddress: monitor.monitorAddress
       }
    })
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div className="app-container">
            <MonitorSelector monitorGroups={this.state.monitorGroups}
                             activeMonitor={this.state.activeMonitor}/>
            <Route exact path="/" />
            {this.state.isLoaded &&
              <React.Fragment>
              <Route path="/monitor/:monitorGroupID/address/:monitorAddress?" render={(props) => <MonitorView activeMonitor={this.state.activeMonitor} onMonitorSelection={this.handleMonitorSelection} {...props}/>} />
              <Route path="/monitor/:monitorGroupID" render={(props) => <MonitorView activeMonitor={this.state.activeMonitor} onMonitorSelection={this.handleMonitorSelection} {...props}/>} />
              </React.Fragment>
            }
            </div>
        </Router>

      </div>
    );
  }
}

export default App;
