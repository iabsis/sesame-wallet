import axios from "axios";
import { config } from "../config/config";

export type Slot = {
  min: number;
  max: number;
};

export const getSlotsAvailable = (jwtToken?: String): Promise<{ data: Slot }> => {
  let url = `${config.API_URL}/slot`;
  return axios.get(url, {
    headers: {
      Authorization: jwtToken,
    },
  });
};
