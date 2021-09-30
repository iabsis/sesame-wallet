import { CliqueClient, Wallet } from "alephium-js";
import axios from "axios";
import { config } from "../config/config";

const cliqueClient = new CliqueClient();

export const authenticate = (wallet: Wallet) => {
  const date = Date.now();
  const signature = cliqueClient.messageSign(
    date.toString(),
    wallet.privateKey
  );

  const json = {
    publicKey: wallet.publicKey,
    timestamp: date,
    timestampSignature: signature,
  };

  console.log("post json", json);
  return axios.post(`${config.API_URL}/auth`, json);
};
