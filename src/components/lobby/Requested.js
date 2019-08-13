import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalFooter } from "reactstrap";
import { connect } from "react-redux";
import { acceptGameToServer, declineGameToServer } from "../../client";
import { setGameRequested } from "../../redux/actions";
import { MODAL_TYPE } from "../../constants";

const mapStateToProps = state => {
  const requestedFrom = state.game.requestedFrom;
  const modalType = state.game.modalType;
  return { requestedFrom, modalType };
}

class Requested extends Component {
  acceptGame = () => {
    this.props.setGameRequested({ modalType: MODAL_TYPE.NONE, requestedFrom: null });
    acceptGameToServer(this.props.requestedFrom);
  }

  declineGame = () => {
    this.props.setGameRequested({ modalType: MODAL_TYPE.NONE, requestedFrom: null });
    declineGameToServer(this.props.requestedFrom);
  }

  render() {
    return (
      <div>
        <Modal centered isOpen={this.props.modalType === MODAL_TYPE.REQUESTED}>
          <ModalHeader>Game request from {this.props.requestedFrom}</ModalHeader>
          <ModalFooter>
            <Button color="primary" onClick={this.acceptGame}>Accept</Button>{" "}
            <Button color="danger" onClick={this.declineGame}>Decline</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps, { setGameRequested })(Requested);