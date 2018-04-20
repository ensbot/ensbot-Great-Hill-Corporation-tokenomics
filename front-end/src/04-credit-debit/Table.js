import React, {Component} from 'react';
import BN from 'bn.js';
import './credit-debit.css';

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myData: [],
      ethUnit: 'wei',
    };
<<<<<<< HEAD
=======

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
        accessor: 'articulated'
      }
    ];

    this.columnsSlim = [
      {
        id: 'block_timestamp',
        Header: 'Block Timestamp',
        accessor: d => new Date(d.block_timestamp*1000).toLocaleString('en-US', {timeZone:'UTC'})
      }, {
        Header: 'From',
        accessor: 'fromAddress',
      }, {
        Header: 'To',
        accessor: 'toAddress',
      }, {
        Header: 'Value (wei)',
        accessor: 'valueWei',
      }
    ]
>>>>>>> 814bf378f1941a8c127bb6b7179aec90c99580b4
  }


  componentDidMount = () => {
//.div(1000000000000000000)
  }

  render() {
    return (
      <div>
        <table>
          <tbody>
          <tr>
            <th>Timestamp</th>
            <th>Amount (ETH)</th>
          </tr>
          {this.props.myData.map((row,i) => {
            return <tr key={i}>
              <td>{new Date(row.blockTimeStamp * 1000).toLocaleString()}</td>
              <td>{row.bn.toNumber()}</td>

            </tr>
          })}
        </tbody>
        </table>
      </div>
    );
  }
}

export default Table;