import React, {Component} from 'react';
import ReactTable from 'react-table';
import moment from 'moment';
import 'react-table/react-table.css';
import './my-table.css';

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
        id: 'timestamp',
        Header: 'Timestamp',
        accessor: d => moment(d.blockTimeStamp*1000).format()
      },
      {
        id: 'compound',
        Header: 'Block No. / Tx Index / Trace ID',
        accessor: d => `${d.blockNumber} / ${d.transID} / ${d.traceID}`
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
        Header: 'Error',
        accessor: 'isError',
      }, {
        id: 'articulated',
        Header: 'Articulated Input',
        accessor: d => JSON.stringify(d.articulated)
      }
    ];
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
