import React, {Component} from 'react';
import Table from './Table';
import SimpleBrushChart from './SimpleBrushChart';

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
        <SimpleBrushChart myData={this.props.myData} onZoomChange={() => {return false}}/>
        <Table myData={this.props.myData}/>
      </div>
    );
  }
}

export default ChartAndTable;
