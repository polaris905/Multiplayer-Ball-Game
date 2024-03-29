
import React from "react";
import { Toast, ToastBody, ToastHeader } from "reactstrap";

const Message = (props) => {
  const getToastClass = (from) => {
    switch (from) {
      case "SYSTEM":
        return "p-1 bg-danger my-2 rounded";
      case props.username:
        return "p-1 bg-success my-2 rounded";
      case "GAME":
        return "p-1 bg-warning my-2 rounded";
      default:
        return "p-1 bg-info my-2 rounded";
    }
  }

  const getMessageSenderName = (from) => {
    if (from === props.username) {
      return "Me";
    }
    return from;
  }
  return (
    <div className={getToastClass(props.message.from)}>
      <Toast style={{ maxWidth: "100%" }}>
        <ToastHeader id="message-header">
          {getMessageSenderName(props.message.from) + (props.message.to ? " to " + props.message.to : "") + "  " + new Date(props.message.timestamp).toLocaleString()}
        </ToastHeader>
        <ToastBody id="message-body">{props.message.content}</ToastBody>
      </Toast>
    </div>
  );
}

export default Message;