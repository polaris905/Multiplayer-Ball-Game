import React, { Component } from "react";
import Board from "./Board";
import { connect } from "react-redux";
import { Label, Row, Col, Button } from "reactstrap";
import { sendMovementToServer, sendStartGameToServer } from "../../client";
import GameOver from "./GameOver";

const mapStateToProps = state => {
  const leftPlayer = state.game.leftPlayer;
  const rightPlayer = state.game.rightPlayer;
  const left = state.game.left;
  const right = state.game.right;
  const x = state.game.x;
  const y = state.game.y;
  const modalType = state.game.modalType;
  return { leftPlayer, rightPlayer, left, right, x, y, modalType }
}

class Game extends Component {
  componentDidMount() {
    this.gameBody.focus();
  }

  handleKeyPress = (e) => {
    if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      sendMovementToServer(e.key);
    } else if (e.key === "Enter") {
      sendStartGameToServer(e.key);
    }
  };

  render() {
    return (
      <div className="game-frame" ref={div => { this.gameBody = div; }} tabIndex="0" onKeyDown={this.handleKeyPress}>
        <Button id="game-title" disabled block>
          <Row >
            <Col>{this.props.leftPlayer}</Col>
            <Col>VS</Col>
            <Col>{this.props.rightPlayer}</Col>
          </Row>
        </Button>
        <Board left={this.props.left} right={this.props.right} x={this.props.x} y={this.props.y} />
        <Label id="instruction">Instruction: Use up/down keys to control your paddle. Press enter to start.</Label>
        <GameOver />
      </div>
    )
  }
}

export default connect(mapStateToProps, {})(Game);