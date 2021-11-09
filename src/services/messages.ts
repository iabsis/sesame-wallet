import axios from "axios";
import { config } from "../config/config";

export enum MessageType {
  low,
  medium,
  high,
}

export type Message = {
  _id: string;
  title: string;
  description: string;
  priority: MessageType;
  date: Date;
  expiry_date: Date | null;
  url: string | null;
};

export const getMessages = (jwtToken?: String): Promise<{ data: Array<Message> }> => {
  return axios.get(`${config.API_URL}/messages`, {
    headers: {
      Authorization: jwtToken,
    },
  });
};

export const messageHidden = (message: Message) => {
  let messagesStorage = JSON.parse(localStorage.getItem("messagesStorage") || "{}");
  return !!messagesStorage[message._id];
};

export const hideMessage = (message: Message) => {
  let messagesStorage = JSON.parse(localStorage.getItem("messagesStorage") || "{}");
  messagesStorage[message._id] = {
    hidden: true,
  };

  localStorage.setItem("messagesStorage", JSON.stringify(messagesStorage));
};
