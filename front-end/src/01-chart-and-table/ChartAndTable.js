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


  fetchMonitorTx = () => {
    fetch(`/api/v1/transactions/monitor/${this.props.match.params.monitorAddress}`)
      .then(res => res.json())
      .then(
        (res) => {
          let myData = res.data.map((datum) => {
            datum.input_articulated = JSON.parse(datum.input_articulated);
            return datum;
          });
          this.setState({
            myData: myData,
            isLoaded: true,
        })},
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          })
        });
      };

  componentDidMount = () => {
    this.fetchMonitorTx();
  }

  componentDidUpdate = (prevProps) => {
    if(this.props.match.params.monitorAddress !== prevProps.match.params.monitorAddress) {
      this.fetchMonitorTx();
    }
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
