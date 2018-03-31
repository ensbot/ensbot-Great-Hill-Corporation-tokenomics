import React, {Component} from 'react';
import './App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class Table extends Component {
  constructor(props) {
    super(props);

    this.columns = [
      {
        Header: 'Block Number',
        accessor: 'block_number'
      }, {
        Header: 'Transaction Index',
        accessor: 'tx_index'
      }, {
        Header: 'Trace ID',
        accessor: 'trace_id'
      }, {
        Header: 'From',
        accessor: 'from_address',
      }, {
        Header: 'To',
        accessor: 'to_address',
      }, {
        Header: 'Value (Wei)',
        accessor: 'value_wei',
      }, {
        id: 'gasCost',
        Header: 'Gas Cost (Wei)',
        accessor: d => d.gas_price * d.gas_used,
      }, {
        Header: 'Articulated Input',
        accessor: 'input_articulated'
      }
    ];

    this.state = {
      myData: []
    };
  }

  componentDidMount = () => {
    fetch(`/api/v0/transactions/monitor/${this.props.monitorAddress}`).then(res => res.json()).then((res) => {
      this.setState({myData: res.data});
      console.log(res.data);
    }).catch((err) => {
      console.log(err);
    })
  }

  render() {
    return (
      <div>
        <ReactTable data={this.state.myData} columns={this.columns}/>
      </div>
    );
  }
}

export default Table;
