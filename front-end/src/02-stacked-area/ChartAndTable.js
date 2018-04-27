import React, {Component} from 'react';
import Table from './Table';
import StackedChart from './StackedChart';

// import ReactTable from 'react-table';
// import 'react-table/react-table.css';

class ChartAndTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myData: [],
      isLoaded: false,
      error: null
    };
  }

  render() {
    return (
      <div>
        <StackedChart myData={this.props.myData} onZoomChange={() => {return false}}/>
        <Table myData={this.props.myData}/>
      </div>
    );
  }
}

export default ChartAndTable;
