import React, {Component} from 'react';
import Table from './Table';
import SimpleBrushChart from './SimpleBrushChart';

class ChartAndTableDataFiltersToo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myData: [],
      isLoaded: false,
      error: null,
      dataBounds: [new Date('1970'), new Date(Date.now())]
    };
  }

  filterData = (data) => {
    return this.state.dataBounds === [0,0] ? data : data.filter((row) => {
      let date = new Date(row.block_timeStamp * 1000);
      return date >= this.state.dataBounds[0] && date <= this.state.dataBounds[1];
    });
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

  handleZoomChange = (bounds) => {
    this.setState({dataBounds: bounds});
  }

  render() {
    return (
      <div>
        <SimpleBrushChart myData={this.state.myData} onZoomChange={this.handleZoomChange}/>
        <Table myData={this.filterData(this.state.myData)}/>
      </div>
    );
  }
}

export default ChartAndTableDataFiltersToo;
