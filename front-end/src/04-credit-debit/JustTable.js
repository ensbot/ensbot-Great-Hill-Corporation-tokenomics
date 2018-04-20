import React, {Component} from 'react';
import BN from 'bn.js';
import Table from './Table';

// import ReactTable from 'react-table';
// import 'react-table/react-table.css';

class JustTable extends Component {
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
          let myData = res.data.filter((datum) => {
              return !datum.isError;
          })
          .map((datum) => {
            datum.bn = new BN(''+datum.valueWei).div(new BN('1000000000000000000'));
            return datum;
          })
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
        <Table myData={this.state.myData}/>
      </div>
    );
  }
}

export default JustTable;
