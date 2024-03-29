import React, { Component } from "react";
import { connect } from "react-redux";
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Tooltip } from "reactstrap";
import { setOnboardingToServer, setLogoutToServer } from "../../client";
import { setOnboarding, setLogout, setTooltip } from "../../redux/actions";
import { TOOLTIP } from "../../constants";

const mapStateToProps = state => {
  const tooltipOrder = state.lobby.tooltipOrder;
  return { tooltipOrder };
}

class ActionMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false
    };
  }

  handleCloseTooltip = () => {
    if (this.props.tooltipOrder === TOOLTIP.MENU) {
      this.props.setTooltip(TOOLTIP.NONE);
    }
  }

  toggle = () => {
    this.handleCloseTooltip();
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  startOnboarding = () => {
    this.props.setOnboarding(false);
    setOnboardingToServer(false);
  }

  logout = () => {
    this.props.setLogout();
    setLogoutToServer();
  }

  render() {
    return (
      <ButtonDropdown id="menu" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret id="action-menu">
          Menu
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={this.startOnboarding}>Onboarding</DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={this.logout}>Logout</DropdownItem>
        </DropdownMenu>
        <Tooltip placement="auto" isOpen={this.props.tooltipOrder === TOOLTIP.MENU} onClick={this.handleCloseTooltip} target="action-menu">
          Open menu to see more options.
        </Tooltip>
      </ButtonDropdown>
    );
  }
}

export default connect(mapStateToProps, { setOnboarding, setLogout, setTooltip })(ActionMenu);