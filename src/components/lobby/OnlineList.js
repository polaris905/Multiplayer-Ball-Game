import React, { Component } from 'react';
import { Button, Table, Tooltip } from 'reactstrap';
import { connect } from "react-redux";
import Player from "./Player";
import { TOOLTIP } from "../../constants";

const mapStateToProps = state => {
  const onlineUsers = state.lobby.onlineUsers;
  const username = state.lobby.userInfo.username;
  const tooltipOrder = state.lobby.tooltipOrder;
  return { onlineUsers, username, tooltipOrder };
}

class OnlineList extends Component {
  render() {
    let list = [];
    for (let player in this.props.onlineUsers) {
      list.push(
        <Player
          player={player}
          win={this.props.onlineUsers[player].win}
          lose={this.props.onlineUsers[player].lose}
          status={this.props.onlineUsers[player].status} />
      );
    }

    return (
      <div className="online-list-frame">
        <Button id="online-player" disabled block>Online Players</Button>
        <div className="online-list-content">
          <Table>
            <thead>
              <Tooltip placement="left" isOpen={this.props.tooltipOrder === TOOLTIP.REQUEST_GAME} target="action">
                Select an available player to send a game request.
              </Tooltip>
              <tr>
                <th>Username</th>
                <th className="win-lose">Win</th>
                <th className="win-lose">Lose</th>
                <th className="game-status">Status</th>
                <th id="action">Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map(player => { return player; })}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
};

export default connect(mapStateToProps, {})(OnlineList);
