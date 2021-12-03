import axios from "axios";
import { config } from "../config/config";

type BookingPeriod = {
  periodStart: string;
  periodEnd: string;
  quantity: number;
};

export type Booking = {
  _id: string;
  bookedAt: Date;
  period: BookingPeriod[];
  nextInvoice: string;
  status: string;
  stripeID: string;
  referral: string;
};

export const getBookings = (jwtToken?: String, onlyCurrent: boolean = false): Promise<{ data: Array<Booking> }> => {
  let url = `${config.API_URL}/booking`;

  return axios.get(url, {
    headers: {
      Authorization: jwtToken,
    },
  });
};
