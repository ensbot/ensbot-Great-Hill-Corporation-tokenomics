import React, {Component} from 'react';
import {
  Link
} from 'react-router-dom';
class MonitorSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myData: [],
      isLoaded: false,
      error: null
    };
  }


  componentDidMount = () => {
    fetch(`/api/v1/ui`)
      .then(res => res.json())
      .then(
        (res) => {
          this.setState({
            myData: res.data.monitorAddresses,
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
      <div className='monitor-selectors'>
        <ul>
        {this.state.myData.map((monitorAddress, i) => {
          return <li key={i}><Link to={{pathname: '/monitor/' + monitorAddress}}>{monitorAddress}</Link></li>
        })}
      </ul>
      </div>
    );
  }
}

export default MonitorSelector;
