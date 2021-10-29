import React, { useState } from "react";

import { SectionContent } from "./PageComponents";
import { Button } from "./Buttons";
import {
  addBiometricPasswordFor,
  disableBiometricFor,
  enableBiometricFor,
} from "../services/fingerprints";

interface AskForBiometricProps {
  walletName: string;
  finished: (choice: boolean) => void;
  failure: (err: any) => void;
  success: () => void;
  walletPassword?: string;
}

export const AskForBiometric = ({
  walletName,
  walletPassword,
  finished,
  success,
  failure,
}: AskForBiometricProps) => {
  const handleEnable = () => {
    if (!walletPassword) {
      return finished(true);
    }

    enableBiometricFor(walletName);
    addBiometricPasswordFor(walletName, walletPassword)
      .then(() => {
        success();
      })
      .catch((err) => {
        failure(err);
      })
      .finally(() => {
        finished(true);
      });
  };

  const handleDisable = () => {
    disableBiometricFor(walletName);
    finished(false);
  };

  return (
    <div className="popup-biometric-enable">
      <h3>
        Wouly you like to use the fingerprint authentication for the wallet{" "}
      </h3>
      <strong>{walletName}</strong>?
      <SectionContent inList>
        <Button marginBottom onClick={handleEnable} type="submit">
          Yes
        </Button>
        <Button onClick={handleDisable} type="submit">
          No
        </Button>
      </SectionContent>
    </div>
  );
};
