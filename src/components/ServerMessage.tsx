import dayjs from "dayjs";
import { useState } from "react";
import { hideMessage, Message } from "../services/messages";

interface ServerMessageProps {
  message: Message;
}

let ServerMessage = ({ message }: ServerMessageProps) => {
  const [hidden, setHidden] = useState(false);
  const openBrowser = (url: string | null) => {
    if (url) {
      window.open(url, "_system");
    }
  };

  const closeMessage = () => {
    hideMessage(message);
    setHidden(true);
  };

  return (
    <div className={`server-message server-message-${message.priority} ${hidden ? "hide-it" : ""}`}>
      <button className="close" type="button" onClick={() => closeMessage()}>
        &times;
      </button>
      <div className="title">{message.title}</div>
      <div className="time">{dayjs(message.date).format("D MMM, YYYY, HH:mm")}</div>
      <div className="description">{message.description}</div>
      {message.url && (
        <div className="url" onClick={() => openBrowser(message.url)}>
          See more
        </div>
      )}
    </div>
  );
};

export default ServerMessage;
