import React, { Component } from 'react';
import { Button, Modal, ModalHeader, ModalFooter } from 'reactstrap';
import { connect } from "react-redux";
import { closeGameRequestToServer } from "../../client";
import { setGameRequesting } from "../../redux/actions";
import { MODAL_TYPE } from "../../constants";

const mapStateToProps = state => {
  const requestTo = state.game.requestTo;
  const modalType = state.game.modalType;
  return { requestTo, modalType };
}

class Requesting extends Component {
  closeRequest = () => {
    this.props.setGameRequesting({ modalType: MODAL_TYPE.NONE, requestTo: null });
    closeGameRequestToServer(this.props.requestTo);
  }

  render() {
    return (
      <div>
        <Modal centered isOpen={this.props.modalType === MODAL_TYPE.REQUESTING}>
          <ModalHeader>{"Waiting for " + this.props.requestTo + "'s response."}</ModalHeader>
          <ModalFooter>
            <Button color="danger" onClick={this.closeRequest}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default connect(mapStateToProps, { setGameRequesting })(Requesting);