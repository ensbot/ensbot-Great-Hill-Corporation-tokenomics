import React, {Component} from 'react';

const MonitorHeading = (props) => {
  return (
    <div className="monitor-heading">
      {props.address}
    </div>
  )
}

class MonitorView extends Component {
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
            datum.articulated = JSON.parse(datum.articulated);
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
        <MonitorHeading address={this.props.match.params.monitorAddress}/>
      </div>
    );
  }
}

export default MonitorView;
