import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

const MonitorViewHeading = (props) => {
  return (
    <div className="monitor-heading">
      {props.address}
    </div>
  )
}

const MonitorViewMenu = ({match}) => {
  return (
    <ul className="menu-view-list">
      <li><Link to={`${match.url}/overview`}>Monitor Overview</Link></li>
      <li><Link to={`${match.url}/activity`}>Monitor Activity</Link></li>
      <li><Link to={`${match.url}/contract-interaction`}>Monitor Contract Interaction</Link></li>
      <li><Link to={`${match.url}/settings`}>Monitor Settings</Link></li>
    </ul>
  )
}

const MonitorViewContainer = (props) => {
  return (
    <div>
      {props.match.params.viewSelection}
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
    fetch(`/api/v1/transactions/monitor/${this.props.match.params.monitorAddress}`)
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
        })},
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          })
        });
      };

  componentDidMount = () => {
    this.fetchMonitorTx();
  }

  componentDidUpdate = (prevProps) => {
    if(this.props.match.params.monitorAddress !== prevProps.match.params.monitorAddress) {
      this.fetchMonitorTx();
    }
  }

  render() {
    console.log(this.props.match.url);
    return (
      <div>
        <MonitorViewHeading address={this.props.match.params.monitorAddress}/>
        <MonitorViewMenu match={this.props.match}/>
        <Route path={`${this.props.match.url}/:viewSelection`} component={MonitorViewContainer} />
      </div>
    );
  }
}

export default MonitorView;
