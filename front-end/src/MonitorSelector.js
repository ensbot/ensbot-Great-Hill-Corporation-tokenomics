import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {Dropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
class MonitorSelector extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false
    };
  }

  toggle = () => {
      this.setState({
        dropdownOpen: !this.state.dropdownOpen
      });
    }

  makeMonitorGroupMenu = (monitorGroup, i) => {
    let groupName = monitorGroup.groupName === "null" ? "Other" : monitorGroup.groupName;
    let groupMemberList = monitorGroup.addresses.map((monitor, j) => {
      let monitorName = monitor.monitorName === null ? monitor.monitorAddress : monitor.monitorName;
      return <DropdownItem className='group-member' key={i + '' + j}><Link to={{pathname: `/monitor/${monitor.monitorAddress}`}}>{monitorName}</Link></DropdownItem>
    });
    return (
      <React.Fragment key={monitorGroup.monitorGroupID}>
        <DropdownItem className='group-header' tag="a" href={'/monitor-group/' + monitorGroup.monitorGroupID}>Group: {groupName}</DropdownItem>
        {groupMemberList}
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className='monitor-selectors'>
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle caret>
          Monitors
        </DropdownToggle>
          <DropdownMenu>
        {this.props.monitorGroups.map((monitorGroup, i) => {
          return this.makeMonitorGroupMenu(monitorGroup, i);
        })}
      </DropdownMenu>
      </Dropdown>
      </div>
    );
  }
}

export default MonitorSelector;
