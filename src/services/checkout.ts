import axios from "axios";
import { config } from "../config/config";

export type Cart = {
  dateString: string;
  date: Date | null;
  selected: boolean;
  nbSlots: number;
};

export const checkout = (date: string, cart: Cart[], calculated_price: number, referral: string, jwtToken?: String): Promise<{ data: { url: string } }> => {
  return axios.post(
    `${config.API_URL}/stripe-session-booking`,
    {
      referral,
      calculated_price: parseFloat(calculated_price.toFixed(2)),
      booking: cart
        .filter((item) => item.selected)
        .map((cartItem) => ({
          date: cartItem.dateString,
          nb_slots: cartItem.nbSlots,
        })),
    },
    {
      headers: {
        Authorization: jwtToken,
      },
    }
  );
};
