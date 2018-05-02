import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch} from 'react-router-dom';
import MonitorSelector from './MonitorSelector';
import MonitorView from './MonitorView/MonitorView';
import 'bootstrap/dist/css/bootstrap.css';
import './App.css';
import 'material-design-icons/iconfont/material-icons.css';

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
      .then((res) => {
        return res.data.monitorGroups.map((group) => {
          group.addresses = group.addresses.sort((a,b) => a.monitorName.localeCompare(b.monitorName));
          return group;
        }).sort((a,b) => a.groupName.localeCompare(b.groupName));
      })
      .then(
        (res) => {
          this.setState({
            monitorGroups: res,
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
              <Switch>
              <Route path="/monitor/:monitorGroupID/address/:monitorAddress" render={(props) => <MonitorView activeMonitor={this.state.activeMonitor} onMonitorSelection={this.handleMonitorSelection} {...props}/>} />
              <Route path="/monitor/:monitorGroupID" render={(props) => <MonitorView activeMonitor={this.state.activeMonitor} onMonitorSelection={this.handleMonitorSelection} {...props}/>} />
            </Switch>
            }
            <div className="App-logo">
              <a href="https://quickblocks.io" target="_blank"><img src="https://quickblocks.io/wp-content/uploads/2017/10/logo-white-website-95px.png"/></a>
            </div>
            <div className="footer">
              Powered by <a href="https://quickblocks.io" target="_blank"><strong>QuickBlocks</strong></a>
            </div>
            </div>
        </Router>

      </div>
    );
  }
}

export default App;
