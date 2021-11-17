import axios from "axios";
import { config } from "../config/config";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.guess();

export type MiningHistory = {
  date: Date;
  amount: number;
  address: string;
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

/**
 * Get the history of tokens mined for the specific wallet
 *
 * @param walletAddress Address of the wallet we want to gram the performances from
 * @returns
 */
export const getStats = (walletAddress: string): Promise<MiningHistory[]> => {
  const to = dayjs().set("hour", 0).set("minute", 0).set("second", 0);
  const from = to.subtract(7, "days");

  let currentDate = dayjs(from);
  let dateRange: any = {};
  while (currentDate.isBefore(to) || currentDate.isSame(to)) {
    dateRange[currentDate.format("YYYY-MM-DD")] = 0;
    currentDate = currentDate.add(1, "day");
  }

  const startDate = to.subtract(7, "days").unix();

  return new Promise((resolve, reject) => {
    axios
      .get(`${config.API_URL}/stats?address=${walletAddress}&startDate=${startDate}`, {})
      .then((history) => {
        let structuredData: MiningHistory[] = [];
        for (const data of history.data) {
          if (dateRange[dayjs(data.periodStart).format("YYYY-MM-DD")] !== undefined) {
            dateRange[dayjs(data.periodStart).format("YYYY-MM-DD")] += data.amount;
          }
        }

        for (const key in dateRange) {
          structuredData.push({
            date: dayjs(key).toDate(),
            amount: dateRange[key],
            address: walletAddress,
          });
        }
        resolve(structuredData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

/**
 * Get the price / slot history for the last 60 days
 * @returns
 */
export const getHistory = (): Promise<PriceHistory[]> => {
  return new Promise((resolve, reject) => {
    const startDate = dayjs().subtract(60, "days").unix();
    axios
      .get(`${config.API_URL}/history?startDate=${startDate}`, {})
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
