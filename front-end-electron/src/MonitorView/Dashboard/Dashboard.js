import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import TxChart from './TxChart';
import TxStats from './TxStats';

class Dashboard extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <div className="dashboard-element-white">
          <TxStats data={this.props.myData} />
          <TxChart data={this.props.myData} width='400' height='400' />
        </div>
      </div>
    );
  }
}

export default Dashboard;
