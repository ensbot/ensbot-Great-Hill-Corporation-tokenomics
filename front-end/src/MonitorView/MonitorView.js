import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import ChartAndTable from '../03-bar-chart/ChartAndTable';
import Ct2 from '../02-stacked-area/ChartAndTable';

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
      <div><Link to={`${match.url}/overview`}>Monitor Overview</Link></div>
      <div><Link to={`${match.url}/activity`}>Monitor Activity</Link></div>
      <div><Link to={`${match.url}/contract-interaction`}>Monitor Contract Interaction</Link></div>
      <div><Link to={`${match.url}/settings`}>Monitor Settings</Link></div>
    </div>
  )
}

const MonitorViewContainer = (props) => {
  let component = ((urlParam) => {
    switch(urlParam) {
      case 'overview':
      return <ChartAndTable myData={props.myData}/>;
      case 'activity':
      return <ChartAndTable myData={props.myData}/>;
      case 'contract-interaction':
      return <Ct2 myData={props.myData}/>;
      default:
      return <ChartAndTable myData={props.myData}/>;
    }
  })(props.match.params.viewSelection);
  return (
    <div>
      {props.match.params.viewSelection}
      {component}
    </div>
  )
}

class MonitorView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myData: [],
      isLoaded: false,
      error: null
    };
  }


  fetchMonitorTx = () => {
    return fetch(`/api/v1/transactions/monitor-group/${this.props.match.params.monitorGroupID}`)
      .then(res => res.json())
      .then(
        (res) => {
          let myData = res.data.map((datum) => {
            datum.articulated = JSON.parse(datum.articulated);
            return datum;
          });
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

  componentDidMount = () => {
    this.fetchMonitorTx().then(() => {
      this.props.onMonitorSelection({
        monitorGroupID: this.props.match.params.monitorGroupID,
        monitorAddress: this.props.match.params.monitorAddress
      });
    });
  }

  componentDidUpdate = (prevProps) => {
    if(this.props.match.params.monitorGroupID !== prevProps.match.params.monitorGroupID |
        this.props.match.params.monitorAddress !== prevProps.match.params.monitorAddress) {
      this.props.onMonitorSelection({
        monitorGroupID: this.props.match.params.monitorGroupID,
        monitorAddress: this.props.match.params.monitorAddress
      });
      this.fetchMonitorTx();
    }
  }

  render() {
    console.log(this.props);
    return (
      <div className="monitor-view-container">
        <MonitorViewMenu match={this.props.match} monitorAddress={this.props.match.params.monitorAddress}/>
        <div className="monitor-body">
          <Route path={`${this.props.match.url}/:viewSelection`} render={() => <ChartAndTable match={this.props.match} myData={this.state.myData}/>} />
        </div>
      </div>
    );
  }
}

export default MonitorView;
