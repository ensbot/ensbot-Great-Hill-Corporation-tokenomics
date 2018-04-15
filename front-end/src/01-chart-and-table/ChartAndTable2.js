import React, {Component} from 'react';
import Table from './Table';
import ComplexBrushChart from './ComplexBrushChart';

class ChartAndTable2 extends Component {
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
        <ComplexBrushChart myData={this.state.myData}/>
        <Table myData={this.state.myData}/>
      </div>
    );
  }
}

export default ChartAndTable2;
