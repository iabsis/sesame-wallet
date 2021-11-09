import axios from "axios";
import { config } from "../config/config";
import { fakeResponse } from "./fakeResponse";

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

const messages: Array<Message> = [
  {
    _id: "1",
    title: "Un titre de message",
    description: "lorem dslkfj dlksjf kdjfh kadjlshf kljadshf kjdshf kljs fkjlsd sdfh ksjda hfkjsdh fkjsadf aklsjgfhdshgfjgfjhhg adfjk hsdkjf dfsdfs fsdf sdf",
    priority: MessageType.low,
    date: new Date(),
    expiry_date: new Date(),
    url: null,
  },
  {
    _id: "2",
    title: "Un titre de message",
    description: "lorem dslkfj dlksjf kdjfh kadjlshf kljadshf kjdshf kljs fkjlsd sdfh ksjda hfkjsdh fkjsadf aklsjgfhdshgfjgfjhhg adfjk hsdkjf dfsdfs fsdf sdf",
    priority: MessageType.medium,
    date: new Date(),
    expiry_date: new Date(),
    url: "http://iabsis.com",
  },
  {
    _id: "3",
    title: "Un titre de message",
    description: "lorem dslkfj dlksjf kdjfh kadjlshf kljadshf kjdshf kljs fkjlsd sdfh ksjda hfkjsdh fkjsadf aklsjgfhdshgfjgfjhhg adfjk hsdkjf dfsdfs fsdf sdf",
    priority: MessageType.high,
    date: new Date(),
    expiry_date: new Date(),
    url: null,
  },
];

export const getMessages = (jwtToken?: String): Promise<{ data: Array<Message> }> => {
  // return fakeResponse(messages);
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
