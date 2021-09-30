import axios from "axios";
import { config } from "../config/config";
import { Plan } from "./plans";

export type Invoice = {
  invoiceID: string;
  invoiceDate: string;
  pdfInvoiceLink: string;
  lastPaymentStatus: string;
};

export type Subscription = {
  _id: string;
  nbSlots: number;
  cost: number;
  plan: Plan;
  renewal: boolean;
  invoices: Array<Invoice>;
  requestedAt: string;
  nextInvoice: string;
};

export const getSubscriptions = (
  jwtToken?: String,
  onlyCurrent: boolean = false
): Promise<{ data: Array<Subscription> }> => {
  let url = `${config.API_URL}/subscription`;
  if (onlyCurrent) {
    url = url + `?renewal=true`;
  }
  return axios.get(url, {
    headers: {
      Authorization: jwtToken,
    },
  });
};
export const deleteSubscription = (
  jwtToken: String,
  subscription: Subscription
): Promise<{ data: Array<Subscription> }> => {
  return axios.delete(`${config.API_URL}/subscription/${subscription._id}`, {
    headers: {
      Authorization: jwtToken,
    },
  });
};
