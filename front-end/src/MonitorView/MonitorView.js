import React, {Component} from 'react';
import {Route, NavLink, Redirect} from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import Settings from './Settings';

const MonitorViewHeading = (props) => {
  return (
    <div className="monitor-heading">
      {props.address}
    </div>
  )
}

const MonitorViewMenu = ({match}) => {
  return (
    <div className="menu-view-list">
      <div><NavLink to={`${match.url}/dashboard`} activeClassName="selected"><i className="material-icons">dashboard</i><span>Monitor Dashboard</span></NavLink></div>
      <div><NavLink to={`${match.url}/activity`} activeClassName="selected"><i className="material-icons">query_builder</i><span>Tx Explorer</span></NavLink></div>
      <div><NavLink to={`${match.url}/settings`} activeClassName="selected"><i className="material-icons">settings</i><span>Monitor Settings</span></NavLink></div>
    </div>
  )
}

const MonitorViewContainer = (props) => {
  let component = ((urlParam) => {
    switch(urlParam) {
      case 'overview':
        return <Dashboard myData={props.myData}/>;
      case 'settings':
        return <Settings/>;
      default:
        return <Dashboard myData={props.myData}/>;
    }
  })(props.match.params.viewSelection);
  return (
    <div>
      {component}
    </div>
  )
}

class MonitorView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myData: [],
      filteredData: [],
      isLoaded: false,
      error: null
    };
  }


  fetchMonitorGroupTx = () => {
    return fetch(`/api/v1/transactions/monitor-group/${this.props.match.params.monitorGroupID}`)
      .then(res => res.json())
      .then(
        (res) => {
          let myData = res.data.map((datum) => {
            datum.articulated = JSON.parse(datum.articulated);
            return datum;
          }).sort((a,b) => a.blockTimeStamp - b.blockTimeStamp);
          this.setState({
            myData: myData,
            isLoaded: true,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          })
      });
      };

  filterTxByAddress = (data, address) => {
    return data.filter((datum) => datum.monitorAddress == address)
      .sort((a,b) => a.blockTimeStamp - b.blockTimeStamp);
  }

  fetchOrFilter = () => {

  }

  componentDidMount = () => {
    console.log('componentDidMount');
    this.fetchMonitorGroupTx().then(() => {
      let activeGroupID = this.props.match.params.monitorGroupID,
        activeMonitorAddress = this.props.match.params.monitorAddress;
      this.props.onMonitorSelection({
        monitorGroupID: activeGroupID,
        monitorAddress: activeMonitorAddress // may be undefined
      });
      this.setState({filteredData:
        activeMonitorAddress !== undefined ?
          this.filterTxByAddress(this.state.myData, activeMonitorAddress) :
          this.state.myData
      });
    });
  }

  componentDidUpdate = (prevProps) => {
    console.log('componentDidUpdate');
    let activeGroupID = this.props.match.params.monitorGroupID,
      activeMonitorAddress = this.props.match.params.monitorAddress;
    if(this.props.match.params.monitorGroupID !== prevProps.match.params.monitorGroupID) {
      this.fetchMonitorGroupTx().then(() => {
        this.setState({filteredData:
          activeMonitorAddress !== undefined ?
            this.filterTxByAddress(this.state.myData, activeMonitorAddress) :
            this.state.myData
        });
      });
      this.props.onMonitorSelection({
        monitorGroupID: activeGroupID,
        monitorAddress: activeMonitorAddress // may be undefined
      });
    }
    else if(this.props.match.params.monitorAddress !== prevProps.match.params.monitorAddress) {
      this.setState({filteredData: activeMonitorAddress !== undefined ?
                this.filterTxByAddress(this.state.myData, activeMonitorAddress) :
                this.state.myData})
      this.props.onMonitorSelection({
        monitorGroupID: activeGroupID,
        monitorAddress: activeMonitorAddress // may be undefined
      });
    }
  }

  render() {
    console.log(this.props);
    return (
      <div className="monitor-view-container">
        <MonitorViewMenu match={this.props.match}/>
        <div className="monitor-body">
          <Route exact path={`${this.props.match.url}/`} render={() => (
            <Redirect to={`${this.props.match.url}/dashboard`}/>
          )}/>
          <Route path={`${this.props.match.url}/:viewSelection`} render={(props) => <MonitorViewContainer match={this.props.match} myData={this.state.filteredData} {...props}/>} />
      </div>
      </div>
    );
  }
}

export default MonitorView;
