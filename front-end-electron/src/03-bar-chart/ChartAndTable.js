import React, {Component} from 'react';
import Table from './Table';
import BarChart from './BarChart';

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
        <BarChart myData={this.props.myData} onZoomChange={() => {return false}}/>
        <Table myData={this.props.myData}/>
      </div>
    );
  }
}

export default ChartAndTable;
