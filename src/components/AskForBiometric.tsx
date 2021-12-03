import { SectionContent } from "./PageComponents";
import { Button } from "./Buttons";
import { addBiometricPasswordFor, disableBiometricFor, enableBiometricFor } from "../services/fingerprints";

import fingerprint from "../images/fingerprint.svg";
interface AskForBiometricProps {
  walletName: string;
  finished: (choice: boolean) => void;
  failure: (err: any) => void;
  success: () => void;
  walletPassword?: string;
}

export const AskForBiometric = ({ walletName, walletPassword, finished, success, failure }: AskForBiometricProps) => {
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
      <h1>Fingerprint access</h1>
      <h3>
        Would you like to unlock your wallet <strong className="accent">{walletName}</strong> with your fingerprint?
      </h3>

      <img className="big-image" src={fingerprint} alt="Fingerprint" />
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
