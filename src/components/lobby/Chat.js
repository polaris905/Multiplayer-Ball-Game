import React, { Component } from "react";
import { Button, Input, Tooltip, InputGroup, InputGroupAddon } from "reactstrap";
import { connect } from "react-redux";
import { sendMessageToServer } from "../../client";
import { setTooltip } from "../../redux/actions";
import Message from "./Message";
import { TOOLTIP } from "../../constants"

const mapStateToProps = state => {
  const messages = state.lobby.messages;
  const gameInfo = state.lobby.gameInfo;
  const username = state.lobby.userInfo.username;
  const tooltipOrder = state.lobby.tooltipOrder;
  return { messages, gameInfo, username, tooltipOrder }
}

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      tooltipOpen: false,
    };
  }

  componentDidMount() {
    if (this.props.tooltipOrder === TOOLTIP.SEND_MESSAGE) {
      this.setState({
        tooltipOpen: true,
      });
    }
  }

  handleInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  handleSendMessage = () => {
    this.handleCloseTooltip();
    sendMessageToServer(this.state.input);
    this.setState({ input: "" });
  }

  handleCloseTooltip = () => {
    if (this.state.tooltipOpen) {
      this.setState({
        tooltipOpen: false
      });
      this.props.setTooltip(TOOLTIP.REQUEST_GAME);
    }
  }

  handleKeyPress = event => {
    if (event.key === "Enter" && this.state.input.length > 0) {
      this.handleSendMessage();
    }
  };

  scrollToBottom = () => {
    this.endLine.scrollIntoView({ behavior: "smooth" });
  }

  componentDidUpdate() {
    this.scrollToBottom();
  };

  render() {
    return (
      <div className="chat-frame">
        <Button id="chat-room" disabled block>Chat Room</Button>
        <div className="chat-content">
          {this.props.messages.map(message => {
            return (
              <Message key={message.from + message.timestamp} message={message} username={this.props.username} />
            );
          })}
          <div
            ref={(endLine) => { this.endLine = endLine; }} />
        </div>
        <InputGroup>
          <Input id="message-input"
            type="text"
            value={this.state.input}
            onChange={this.handleInputChange}
            placeholder="Type here to send a message..."
            onKeyPress={this.handleKeyPress} />
          <InputGroupAddon addonType="prepend">
            <Button id="message-send" color="success" onClick={this.handleSendMessage}>SEND</Button>
          </InputGroupAddon>
        </InputGroup>
        <Tooltip placement="top" isOpen={this.state.tooltipOpen} onClick={this.handleCloseTooltip} target="message-input">
          Send a message.
        </Tooltip>
      </div>
    );
  }
}

export default connect(mapStateToProps, { setTooltip })(Chat);