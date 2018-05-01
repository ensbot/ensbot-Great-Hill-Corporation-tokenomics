import React, {Component} from 'react';
import {Route, Link} from 'react-router-dom';
import TxChart from './TxChart';

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myData: [],
      isLoaded: false,
      error: null
    };
  }

  componentDidMount = () => {
  }

  componentDidUpdate = (prevProps) => {
  }

  render() {
    return (
      <div>
        <div className="dashboard-element-white">
          <TxChart data={this.props.myData} width='300' height='300' />
        </div>
      </div>
    );
  }
}

export default Dashboard;
