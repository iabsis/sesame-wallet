import axios from "axios";
import { config } from "../config/config";

export const checkout = (
  planId: string,
  qty: number,
  jwtToken?: String
): Promise<{ data: { url: string } }> => {
  // ${config.API_URL}/stripe-session

  return axios.post(
    `${config.API_URL}/stripe-session`,
    { planId, qty },
    {
      headers: {
        Authorization: jwtToken,
      },
    }
  );
};
