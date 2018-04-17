import React, {Component} from 'react';
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
        Header: 'Monitor Address',
        accessor: 'monitorAddress'
      },
      {
        Header: 'Block Number',
        accessor: 'blockNumber'
      }, {
        Header: 'Transaction Index',
        accessor: 'transID'
      }, {
        Header: 'Trace ID',
        accessor: 'traceID'
      }, {
        Header: 'From',
        accessor: 'fromAddress',
      }, {
        Header: 'To',
        accessor: 'toAddress',
      }, {
        Header: 'Value (wei)',
        accessor: 'valueWei',
      }, {
        id: 'gasCost',
        Header: 'Gas Cost (wei)',
        accessor: row => row.gasPrice * row.gasUsed,
      }, {
        Header: 'Error',
        accessor: 'isError',
      }, {
        Header: 'Articulated Input',
        accessor: 'inputArticulated'
      }
    ];
  }


  componentDidMount = () => {

  }

  render() {
    return (
      <div>
        <ReactTable data={this.props.myData} columns={this.columns}/>
      </div>
    );
  }
}

export default Table;
