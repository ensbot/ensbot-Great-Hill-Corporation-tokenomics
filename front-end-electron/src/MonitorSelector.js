import React, {Component} from 'react';
import {
  Link
} from 'react-router-dom';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
class MonitorSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myData: [],
      isLoaded: false,
      error: null,
      dropdownOpen: false
    };
  }

  toggle = () => {
      this.setState({
        dropdownOpen: !this.state.dropdownOpen
      });
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
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle caret>
          Monitored Addresses
        </DropdownToggle>
          <DropdownMenu>
        {this.state.myData.map((monitorAddress, i) => {
          return <DropdownItem key={i} tag="a" href={'/monitor/' + monitorAddress}>{monitorAddress}</DropdownItem>
        })}
      </DropdownMenu>
      </Dropdown>
      </div>
    );
  }
}

export default MonitorSelector;
