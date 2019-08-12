import React, { Component } from 'react';
import { Container, Form, Button, FormGroup, Label, Input, Row, Col, Spinner, Alert } from 'reactstrap';
import { connect } from "react-redux";
import { setLoginRequested, loginToServer } from "../../redux/actions";
import { LOGIN_STATUS } from "../../constants";

const mapStateToProps = state => {
  const status = state.lobby.loginStatus;
  return { status }
};

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: ""
    };
  }

  onFieldChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
      invalidCredentials: false
    });
  }

  handleLogin = () => {
    this.props.setLoginRequested();
    this.props.loginToServer({ username: this.state.username, password: this.state.password });
  };

  keyPressHandler = e => {
    if (e.key === "Enter") {
      this.handleLogin();
    }
  }

  displayError = () => {
    switch (this.props.status) {
      case LOGIN_STATUS.INVALID:
        return <Alert color="danger">Invalid username or password! Please try again.</Alert>;
      case LOGIN_STATUS.FAILED:
        return <Alert color="danger">Error connecting to database!</Alert>
      case LOGIN_STATUS.REPEATED:
        return <Alert color="danger">The username has already login on another browser! Please close it and then try again.</Alert>
    }
  }

  render() {
    if (this.props.status === LOGIN_STATUS.REQUESTED) {
      return (
        <div className="spinner-wrapper">
          <Spinner color="info" style={{ width: '8rem', height: '8rem' }} />
        </div>
      );
    } else {
      return (
        <Container className="login-frame" onKeyPress={this.keyPressHandler}>
          <Form className="login-form">
            <h2>User Login</h2>
            {this.displayError()}
            <FormGroup row>
              <Col>
                <Label for="username">Username:</Label>
                <Input type="text" id="username"
                  value={this.state.username}
                  onChange={this.onFieldChange} />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Col>
                <Label for="password">Password:</Label>
                <Input type="password" id="password"
                  value={this.state.password}
                  onChange={this.onFieldChange} />
              </Col>
            </FormGroup>
            <Row>
              <Col>
                <Button id="login-button" onClick={this.handleLogin} color="primary">Login</Button>
              </Col>
            </Row>
          </Form>
        </Container>
      );
    }
  }
}

export default connect(mapStateToProps, { setLoginRequested, loginToServer })(Login);