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
