import axios from "axios";
import { config } from "../config/config";
import { fakeResponse } from "./fakeResponse";

export type Plan = {
  _id: string;
  name: string;
  duration: number;
  pricePerSlot: number;
  description: string[];
};

export const getPlans = (jwtToken?: String): Promise<{ data: Array<Plan> }> => {
  // return fakeResponse(plans);
  return axios.get(`${config.API_URL}/plan`, {
    headers: {
      Authorization: jwtToken,
    },
  });
};
