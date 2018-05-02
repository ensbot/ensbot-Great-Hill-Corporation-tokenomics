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

  getFnData = (data) => {
    return _(data).groupBy((datum) => {
      return datum.fnType
    })
    .map((val, key) => ({fnName: key, tx: val}))
    .sort((a,b) => a.tx - b.tx)
    .value();
  }

  render() {
    return (
      <div className={`dashboard ${!this.props.isLoaded ? 'flex-center' : null}`}>
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
