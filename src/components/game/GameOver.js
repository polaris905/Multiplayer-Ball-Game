import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalFooter } from 'reactstrap';
import { connect } from "react-redux";
import { confirmGameOverToServer } from "../../client";
import { setPage } from "../../redux/actions";
import { PAGE } from "../../constants";

const mapStateToProps = state => {
  const winner = state.game.winner;
  const loser = state.game.loser;
  const modalType = state.game.modalType;
  const username = state.lobby.userInfo.username;
  return { winner, loser, modalType, username };
}

class GameOver extends Component {
  render() {
    const confirmGameOver = () => {
      this.props.setPage(PAGE.LOBBY);
      confirmGameOverToServer();
    }

    return (
      <div>
        <Modal centered isOpen={this.props.modalType === "GAMEOVER"}>
          <ModalHeader>{"Game Over. " + (this.props.winner === this.props.username ? "You win!" : "You lose!")}</ModalHeader>
          <ModalFooter>
            <Button color="primary" onClick={confirmGameOver}>Confirm</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps, { setPage })(GameOver);