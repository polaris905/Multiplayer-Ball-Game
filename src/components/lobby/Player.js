import React, { Component } from 'react';
import { Button, Label } from 'reactstrap';
import { connect } from "react-redux";
import { requestGame, setGameRequesting, setTooltip } from "../../redux/actions";
import { MODAL_TYPE, TOOLTIP } from "../../constants";

const mapStateToProps = state => {
  const username = state.lobby.userInfo.username;
  const tooltipOrder = state.lobby.tooltipOrder;
  return { username, tooltipOrder };
}

class Player extends Component {
  requestGame = () => {
    if (this.props.tooltipOrder === TOOLTIP.REQUEST_GAME) {
      this.props.setTooltip(TOOLTIP.MENU);
    }
    this.props.setGameRequesting({ modalType: MODAL_TYPE.REQUESTING, requestTo: this.props.player });
    this.props.requestGame(this.props.player);
  }

  render() {
    return (
      <tr>
        <td><Label>{this.props.player === this.props.username ? this.props.username + " (Me)" : this.props.player}</Label></td>
        <td className="win-lose"><Label>{this.props.win}</Label></td>
        <td className="win-lose"><Label>{this.props.lose}</Label></td>
        <td className="game-status"><Label>{this.props.status}</Label></td>
        <td>
          {this.props.status === 'available' && this.props.player !== this.props.username ?
            <Button color="success" size="sm" onClick={this.requestGame}>
              Play
            </Button> : ""
          }
        </td>
      </tr>
    );
  }
}

export default connect(mapStateToProps, { requestGame, setGameRequesting, setTooltip })(Player);