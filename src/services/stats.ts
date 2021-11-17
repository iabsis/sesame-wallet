import axios from "axios";
import { config } from "../config/config";
import dayjs from "dayjs";

export type MiningHistory = {
  periodStart: Date;
  periodEnd: Date;
  amount: number;
  address: number;
  slot: number;
};

type PlanPrice = {
  plan_id: string;
  price: number;
};

export type PriceHistory = {
  date: Date;
  prices: PlanPrice[];
  bestPrice: number;
};

export const getStats = (walletAddress: string): Promise<MiningHistory[]> => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.API_URL}/stats?address=${walletAddress}`, {})
      .then((history) => {
        resolve(
          history.data.map((histo: any) => ({
            periodStart: dayjs(histo.periodStart).toDate(),
            periodEnd: dayjs(histo.periodEnd).toDate(),
            amount: histo.amount,
            address: histo.address,
            slot: histo.slot,
          }))
        );
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getHistory = (): Promise<PriceHistory[]> => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${config.API_URL}/history`, {})
      .then((history) => {
        resolve(
          history.data
            .filter((histo: any) => {
              const today = dayjs().format("YYYY-MM-DD");

              if (histo.date <= "2021-11-09") {
                return false;
              }
              return histo.date !== today;
            })
            .map((histo: PriceHistory) => {
              let bestPrice = histo.prices.length ? 100000 : 0;
              histo.prices.forEach((price) => {
                bestPrice = Math.min(bestPrice, price.price);
              });

              return {
                date: dayjs(histo.date).toDate(),
                prices: histo.prices,
                bestPrice,
              };
            })
            .sort((price1: PriceHistory, price2: PriceHistory) => {
              if (price1.date.getTime() === price2.date.getTime()) return 0;
              return price1.date.getTime() < price2.date.getTime() ? -1 : 1;
            })
        );
      })
      .catch((error) => {
        reject(error);
      });
  });
};
