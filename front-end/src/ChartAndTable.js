import React, {Component} from 'react';
import './App.css';
import Table from './Table';
import Chart from './Chart';
// import ReactTable from 'react-table';
// import 'react-table/react-table.css';

class ChartAndTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myData: [],
    };
  }


  componentDidMount = () => {
    fetch(`/api/v1/transactions/monitor/${this.props.monitorAddress}`).then(res => res.json()).then((res) => {
      this.setState({myData: res.data});
    }).catch((err) => {
      console.log(err);
    })
  }

  render() {
    return (
      <div>
        <Chart myData={this.state.myData}/>
        <Table myData={this.state.myData}/>
      </div>
    );
  }
}

export default ChartAndTable;
