import { Transaction } from "alephium-js/dist/api/api-explorer";
import axios from "axios";
import { loadSettingsOrDefault } from "../utils/clients";

const getUniqueListBy = (arr: Array<any>, key: string) => {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
};

/**
 * Return the last X transactions opered on this alephium address
 * @param walletAddress
 * @param numberOfTransactions
 * @returns
 */
export const getWalletTransactions = (walletAddress: string, numberOfTransactions: number): Promise<Array<Transaction>> => {
  const nbPages = Math.floor(numberOfTransactions / 100) + 1;
  const settings = loadSettingsOrDefault();

  let promises: Array<Promise<any>> = [];
  for (let i = 0; i < nbPages; i++) {
    promises.push(axios.get(`${settings.explorerApiHost}/addresses/${walletAddress}/transactions?page=${i + 1}&limit=100`));
  }

  return new Promise((resolve, reject) => {
    Promise.all(promises)
      .then((data) => {
        let allData: Array<any> = [];
        data.forEach((currentPromise) => {
          allData = allData.concat(currentPromise.data);
        });

        // First remove duplicates (in case that new transactions come during pagination browse)
        allData = getUniqueListBy(allData, "hash").sort((a: Transaction, b: Transaction) => {
          if (a.timestamp === b.timestamp) return 0;
          return a.timestamp < b.timestamp ? -1 : 1;
        });

        resolve(allData.slice(0, numberOfTransactions));
      })
      .catch((err) => {
        reject(err);
      });
  });
};
