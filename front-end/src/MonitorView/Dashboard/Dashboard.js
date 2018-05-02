import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import TxChart from './TxChart';
import TxStats from './TxStats';
import SimpleDashTable from './SimpleDashTable';
import _ from 'lodash';

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  getFnType = (string) => {
    if(string.trim() === '0x') {
      return 'none';
    } else if (string.trim().slice(0,2) === '0x') {
      return 'unknown';
    } else {
      return string;
    }
  }

  getFnData = (data) => {
    return _(data).map((datum) => {
        datum.fnType = this.getFnType(datum.articulated[0]);
        return datum;
    }).groupBy((datum) => {
      return datum.fnType
    })
    .map((val, key) => ({fnName: key, tx: val}))
    .sort((a,b) => a.tx - b.tx)
    .value();
  }

  render() {
    return (
      <div className="dashboard">
        <div className="dashboard-element">
          <TxStats data={this.props.myData} />
          <TxChart data={this.props.myData} width='400' height='400' />
        </div>
        {this.props.myData.length &&
        <div className="dashboard-element">

          <SimpleDashTable data={this.getFnData(this.props.myData)}/>
        </div>
        }
      </div>
    );
  }
}

export default Dashboard;
