import React, { Component } from 'react';
import { connect } from "react-redux";
import OnlineList from './OnlineList';
import Chat from './Chat';
import Requested from './Requested';
import Requesting from './Requesting';
import OnboardingSlides from "../onboarding/OnboardingSlides";
import { Container, Row, Col } from "reactstrap";

const mapStateToProps = state => {
  const userInfo = state.lobby.userInfo
  const modalType = state.game.modalType;
  return { userInfo, modalType };
}

class Lobby extends Component {
  displayModal = () => {
    switch (this.props.modalType) {
      case 'REQUESTING':
        return <Requesting />;
      case 'REQUESTED':
        return <Requested />;
      default:
        return "";
    }
  }

  render() {
    if (this.props.userInfo.onboardingComplete) {
      return (
        <Container className="lobby-frame">
          <Row>
            <Col xs="6"><OnlineList /></Col>
            <Col xs="6"><Chat />{this.displayModal()}</Col>
          </Row>
        </Container>
      );
    } else {
      return (
        <OnboardingSlides />
      )
    }
  }
}

export default connect(mapStateToProps, {})(Lobby);