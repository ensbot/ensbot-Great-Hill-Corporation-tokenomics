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

  makeMonitorGroupMenu = (monitorGroup, i) => {
    let groupName = monitorGroup.groupName === "null" ? "Other" : monitorGroup.groupName;
    let monitorGroupID = monitorGroup.monitorGroupID === "null" ? "unsorted" : monitorGroup.monitorGroupID;
    let groupMemberList = monitorGroup.addresses.map((monitor, j) => {
      let monitorName = monitor.monitorName === null ? monitor.monitorAddress : monitor.monitorName;
      return <DropdownItem className='group-member' key={i + '' + j}><Link to={{pathname: `/monitor/${monitor.monitorGroupID}/${monitor.monitorAddress}`}}>{monitorName}</Link></DropdownItem>
    });
    return (
      <React.Fragment key={monitorGroup.monitorGroupID}>
        <DropdownItem className='group-header'><Link to={{pathname: `/monitor/${monitorGroup.monitorGroupID}`}}>Group: {groupName}</Link></DropdownItem>
        {groupMemberList}
      </React.Fragment>
    );
  }


  toggle = () => {
      this.setState({
        dropdownOpen: !this.state.dropdownOpen
      });
    }

  render() {
    return (
      <div className='monitor-selectors'>
        <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
          <DropdownToggle caret>
            <div className='monitor-selector-headings'>
              <h5>{this.props.activeMonitor.groupName}</h5>
              <h4>{this.props.activeMonitor.monitorName} <span className="small">{this.props.activeMonitor.monitorAddress ? `(${this.props.activeMonitor.monitorAddress})` : null}</span></h4>
            </div>
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
