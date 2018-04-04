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


  componentDidMount = () => {
    fetch(`/api/v1/transactions/monitor/${this.props.monitorAddress}`)
      .then(res => res.json())
      .then(
        (res) => {
          this.setState({
            myData: res.data,
            isLoaded: true,
        })},
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          })
        });
  }

  render() {
    return (
      <div>
        <SimpleBrushChart myData={this.state.myData} onZoomChange={() => {return false}}/>
        <Table myData={this.state.myData}/>
      </div>
    );
  }
}

export default ChartAndTable;
