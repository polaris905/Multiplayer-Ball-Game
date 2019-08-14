import React, { Component } from "react";
import { Form, FormGroup, Button, Modal, ModalBody, ModalFooter, Label, Input, Col, Spinner, Alert } from "reactstrap";
import { connect } from "react-redux";
import { setRegisterRequested, registerToServer, setRegisterClose } from "../../redux/actions";
import { REGISTER_STATUS } from "../../constants";

const mapStateToProps = state => {
  const status = state.lobby.registerStatus;
  return { status }
};

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password1: "",
      password2: ""
    };
  }

  onFieldChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  handleRegister = () => {
    this.props.setRegisterRequested();
    this.props.registerToServer({ username: this.state.username, password: btoa(this.state.password1) });
  };

  handleCancel = () => {
    this.props.setRegisterClose();
    this.setState({
      username: "",
      password1: "",
      password2: ""
    })
  }

  displayError = () => {
    switch (this.props.status) {
      case REGISTER_STATUS.SUCCESSFUL:
        return <Alert color="success">Congratulations! Registration successfully.</Alert>;
      case REGISTER_STATUS.REPEATED:
        return <Alert color="danger">The username has been used. Please choose a new username.</Alert>;
      case REGISTER_STATUS.FAILED:
        return <Alert color="danger">Error connecting to database!</Alert>
      default:
        return "";
    }
  }

  invalidUsername = () => {
    return this.state.username === "";
  }

  displayUsernameTip = () => {
    if (this.invalidUsername()) {
      return <p className="register-tip">*Username could not be empty.</p>
    }
    return "";
  }

  invalidPassword1 = () => {
    return this.state.password1 === "";
  }

  displayPassword1Tip = () => {
    if (this.invalidPassword1()) {
      return <p className="register-tip">*Password could not be empty.</p>
    }
    return "";
  }

  invalidPassword2 = () => {
    return this.state.password1 !== this.state.password2;
  }

  displayPassword2Tip = () => {
    if (this.invalidPassword2()) {
      return <p className="register-tip">*Two passwords are not matched.</p>
    }
    return "";
  }

  registerDisabled = () => {
    return this.invalidUsername() || this.invalidPassword1() || this.invalidPassword2() || this.props.status === REGISTER_STATUS.REQUESTED || this.props.status === REGISTER_STATUS.SUCCESSFUL;
  }

  render() {
    return (
      <Modal centered isOpen={this.props.status !== REGISTER_STATUS.CLOSE}>
        <ModalBody>
          {this.props.status === REGISTER_STATUS.REQUESTED ?
            <div className="spinner-wrapper">
              <Spinner color="info" style={{ width: "8rem", height: "8rem" }} />
            </div> : ""}
          <Form className="login-form">
            <h2>User Register</h2>
            {this.displayError()}
            <FormGroup row>
              <Col>
                <Label for="username">Username:</Label>
                <Input type="text" id="username" value={this.state.username} onChange={this.onFieldChange} />
                {this.displayUsernameTip()}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Label for="password1">Password:</Label>
                <Input type="password" id="password1" value={this.state.password1} onChange={this.onFieldChange} />
                {this.displayPassword1Tip()}
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Label for="password2">Confirm Password:</Label>
                <Input type="password" id="password2" value={this.state.password2} onChange={this.onFieldChange} />
                {this.displayPassword2Tip()}
              </Col>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={this.handleRegister} disabled={this.registerDisabled()}>
            Register
          </Button>{' '}
          <Button color="secondary" onClick={this.handleCancel}>
            {this.props.status === REGISTER_STATUS.SUCCESSFUL ? "Close" : "Cancel"}
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default connect(mapStateToProps, { setRegisterRequested, registerToServer, setRegisterClose })(Register);