import React, {Component} from 'react';
import Table from './Table';
import TxExplorerChart from './TxExplorerChart';

// import ReactTable from 'react-table';
// import 'react-table/react-table.css';

class TxExplorer extends Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className='tx-explorer'>
        <TxExplorerChart myData={this.props.myData} onZoomChange={() => {return false}}/>
        <Table myData={this.props.myData}/>
      </div>
    );
  }
}

export default TxExplorer;
