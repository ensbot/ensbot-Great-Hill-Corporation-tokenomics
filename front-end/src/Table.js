import React, {Component} from 'react';
import './App.css';
import ReactTable from 'react-table';
import 'react-table/react-table.css';

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myData: [],
      ethUnit: 'wei',
    };

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
        Header: 'Value (wei)',
        accessor: 'value_wei',
      }, {
        id: 'gasCost',
        Header: 'Gas Cost (wei)',
        accessor: d => d.gas_price * d.gas_used,
      }, {
        Header: 'Error',
        accessor: 'is_error',
      }, {
        Header: 'Articulated Input',
        accessor: 'input_articulated'
      }
    ];

    this.columnsSlim = [
      {
        id: 'block_timestamp',
        Header: 'Block Timestamp',
        accessor: d => new Date(d.block_timestamp*1000).toLocaleString('en-US', {timeZone:'UTC'})
      }, {
        Header: 'From',
        accessor: 'from_address',
      }, {
        Header: 'To',
        accessor: 'to_address',
      }, {
        Header: 'Value (wei)',
        accessor: 'value_wei',
      }
    ]
  }


  componentDidMount = () => {

  }

  render() {
    return (
      <div>
        <ReactTable data={this.props.myData} columns={this.columnsSlim}/>
      </div>
    );
  }
}

export default Table;
