import { FingerprintAIO } from "@ionic-native/fingerprint-aio";

/**
 *
 * @returns the local storage containing biometric setup
 */
const openBiometricLocalStorage = (): any => {
  let biometricActivationJson: string = localStorage.getItem(`biometricActivation`) as string;
  if (!biometricActivationJson) {
    biometricActivationJson = "{}";
  }

  const biometricActivation = JSON.parse(biometricActivationJson);
  return biometricActivation;
};

/**
 * Override the biometric setup in the localStorage
 * @returns void
 */
const saveBiometricSetup = (data: any): void => {
  localStorage.setItem("biometricActivation", JSON.stringify(data));
};

/**
 * Enable biometric for a specific wallet
 * @param walletName wallet name to enable biometric for
 */
const intBiometricDataForWallet = (walletName: string) => {
  const biometricActivation: any = openBiometricLocalStorage();

  if (!biometricActivation[walletName]) {
    biometricActivation[walletName] = {
      biometricOn: false,
      biometricAsked: false,
    };
  }

  saveBiometricSetup(biometricActivation);
  return biometricActivation;
};

/**
 * Ask for fingerprint, then save the wallet password in the vault
 * @param walletName Name of the wallet
 * @param walletPassword Password of the wallet
 * @param initialData Initial data contained in the wallet (containing password of all wallets)
 * @returns
 */
export const setBiometricPasswordFor = (walletName: string, walletPassword: string, initialData: any) => {
  // Save user's credentials
  initialData[walletName] = walletPassword;
  const secret = JSON.stringify(initialData);

  return new Promise((resolve, reject) => {
    FingerprintAIO.isAvailable()
      .then(() => {
        FingerprintAIO.registerBiometricSecret({
          secret,
          title: `Adding ${walletName} to the credentials store`,
          description: "Use your biometric authentication in order to add this wallet in your credentials store.",
          disableBackup: true,
        })
          .then((data) => {
            enableBiometricFor(walletName);
            resolve(data);
          })
          .catch((e) => {
            console.log("ERROR4", e);
            reject({ reason: "FINGERPRINT_FAILED" });
          });
      })
      .catch((e) => {
        console.log("ERROR5", e);
        reject({ reason: "FINGERPRINT_NOT_AVAILABLE" });
      });
  });
};

/**
 * Ask for fingerprint and return the password of all wallets
 * @returns all biometric data savec by the spplication
 */
export const getBiometricPassword = (): Promise<string | null> => {
  // Save user's credentials
  return new Promise((resolve, reject) => {
    FingerprintAIO.isAvailable()
      .then(() => {
        FingerprintAIO.loadBiometricSecret({
          title: `Access to your wallet`,
          description: "Use your biometric access to open your wallet",
          disableBackup: true,
        })
          .then((data) => {
            resolve(data);
          })
          .catch((e) => {
            if (e.code === -113) {
              // iOS returns an error when trying to access the keyring when empty
              resolve(null);
            } else {
              console.log("ERROR1", e);
              reject({ reason: "FINGERPRINT_FAILED" });
            }
          });
      })
      .catch((e) => {
        console.log("ERROR2", e);
        reject({ reason: "FINGERPRINT_NOT_AVAILABLE" });
      });
  });
};

/**
 * Ask for fingerprint and return the password of a specific wallet
 * @returns Password of a specific wallet encrypted by biometric
 */
export const getBiometricPasswordFor = (walletName: string): Promise<string | null> => {
  // Save user's credentials
  return new Promise((resolve, reject) => {
    FingerprintAIO.isAvailable()
      .then(() => {
        FingerprintAIO.loadBiometricSecret({
          title: `Access ${walletName}'s wallet`,
          description: "Use your biometric access to open your wallet",
          disableBackup: true,
        })
          .then((decryptedData) => {
            const data = JSON.parse(decryptedData);
            resolve(data[walletName] ? data[walletName] : null);
          })
          .catch(() => {
            reject({ reason: "FINGERPRINT_FAILED" });
          });
      })
      .catch(() => {
        reject({ reason: "FINGERPRINT_NOT_AVAILABLE" });
      });
  });
};

export const addBiometricPasswordFor = async (walletName: string, walletPassword: string) => {
  // Save user's credentials
  const decryptedData: string | null = await getBiometricPassword();
  const data = JSON.parse(decryptedData ? decryptedData : "{}");
  if (data && data[walletName] === walletPassword) {
    return true;
  } else {
    return await setBiometricPasswordFor(walletName, walletPassword, data);
  }
};

/**
 * Check if the specified data is activated in the biometric vault
 * @param walletName Wallet to be checked
 * @returns
 */
export const isBiometricEnabledForWallet = (walletName: string): boolean => {
  if (!walletName) {
    return false;
  }

  const biometricActivation: any = intBiometricDataForWallet(walletName);
  return biometricActivation[walletName].biometricOn;
};

/**
 * Check if the specified data has already beem ask for this address
 * @param walletName Wallet to be checked
 * @returns
 */
export const isBiometricAskedForWallet = (walletName: string): boolean => {
  const biometricActivation: any = intBiometricDataForWallet(walletName);
  return biometricActivation[walletName].biometricAsked;
};

/**
 * Enable biometric for a specific wallet
 * @param walletName wallet name to enable biometric for
 */
export const enableBiometricFor = (walletName: string) => {
  const biometricActivation = intBiometricDataForWallet(walletName);

  biometricActivation[walletName].biometricOn = true;
  biometricActivation[walletName].biometricAsked = true;
  saveBiometricSetup(biometricActivation);
};

/**
 * Enable biometric for a specific wallet
 * @param walletName wallet name to enable biometric for
 */
export const disableBiometricFor = (walletName: string) => {
  const biometricActivation = intBiometricDataForWallet(walletName);

  biometricActivation[walletName].biometricOn = false;
  biometricActivation[walletName].biometricAsked = true;
  saveBiometricSetup(biometricActivation);
};

/**
 * Remove viometric settings for an user (ie : When removing an account)
 * @param walletName wallet name to enable biometric for
 */
export const deleteBiometricFor = (walletName: string) => {
  const biometricActivation = intBiometricDataForWallet(walletName);

  if (biometricActivation[walletName]) {
    delete biometricActivation[walletName];
  }

  saveBiometricSetup(biometricActivation);
};
