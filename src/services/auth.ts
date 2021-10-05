import { Wallet } from "alephium-js";
import axios from "axios";
import { config } from "../config/config";

const EC = require('elliptic').ec;
const Sha256 = require("crypto-js/sha256")

const ec = new EC('secp256k1');

export const authenticate = (wallet: Wallet) => {
  const key = ec.keyFromPrivate(wallet.privateKey)
  const date = Date.now().toString();
  const msg = Sha256(date).toString()
  console.log(msg);
  var signature = Buffer.from(key.sign(msg).toDER()).toString('hex');

  const json = {
    publicKey: wallet.publicKey,
    timestamp: date,
    timestampSignature: signature,
  };

  console.log("post json", json);
  return axios.post(`${config.API_URL}/auth`, json);
};
