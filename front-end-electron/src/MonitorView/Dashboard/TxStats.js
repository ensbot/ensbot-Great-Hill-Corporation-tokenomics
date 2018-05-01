import React, {Component} from 'react';
import * as d3 from 'd3';
import moment from 'moment';

class TxStats extends Component {
  constructor(props) {
    super(props);

  }


  formatData = (data) => {
    return data.length;
  }

  componentDidUpdate = () => {

  }


  render() {
    console.log(this.props.data);
    //console.log(this.props.data.length && [moment(this.props.data[0].blockTimeStamp*1000).format(), moment(this.props.data.slice(-1)[0].blockTimeStamp*1000).format()])
    return (
      <div>
      <div className="stat-box">
        <h5>Transactions</h5>
        {this.props.data && this.props.data.length}
      </div>
      <div className="stat-box">
        <h5>Tx/Month</h5>

        {this.props.data.length &&
          (this.props.data.length / Math.abs(moment(this.props.data[0].blockTimeStamp*1000).diff(moment(this.props.data.slice(-1)[0].blockTimeStamp*1000).add(1, 'days'), "months"))).toFixed(1)}
      </div>
    </div>
    );
  }
}

export default TxStats;
