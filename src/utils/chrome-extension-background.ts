/**
 * These functions allow to store the state in the background.js file used by chrome extensions
 */

import { Wallet } from "alephium-js";

/**
 * Store current wallet and credentials in the background.js context.
 * @param wallet
 * @param credentials
 */
export const saveExtensionState = (wallet: Wallet | null, credentials: any) => {
  try {
    if (chrome?.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ action: "set-state", state: { wallet, credentials } });
    }
  } catch (err) {
    console.log("ERROR", err);
  }
};

/**
 * Retrieve wallet and credentials from the background.js if possible.
 */
export const getExtensionState = (): Promise<{ wallet: Wallet | null; credentials: any }> => {
  return new Promise((resolve, reject) => {
    try {
      if (chrome?.runtime?.sendMessage) {
        chrome.runtime.sendMessage({ action: "get-state" }, (data) => {
          resolve(data);
        });
      } else {
        resolve({ wallet: null, credentials: null });
      }
    } catch (err) {
      resolve({ wallet: null, credentials: null });
    }
  });
};
