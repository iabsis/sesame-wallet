import { useContext } from "react";
import styled from "styled-components";
import { WalletManagementContext } from "./WalletManagementContext";
import { InfoBox } from "../../components/InfoBox";
import {
  FooterActions,
  MainPanel,
  PanelContainer,
  PanelContent,
  PanelTitle,
  SectionContent,
} from "../../components/PageComponents";
import { Edit3 } from "lucide-react";
import { Button } from "../../components/Buttons";
import { GlobalContext } from "../../App";
import { StepsContext } from "../MultiStepsController";
import { IonIcon } from "@ionic/react";
import { copy } from "ionicons/icons";

const WalletWordsPage = () => {
  const { mnemonic, plainWallet } = useContext(WalletManagementContext);
  const { onButtonBack, onButtonNext } = useContext(StepsContext);
  const { setSnackbarMessage } = useContext(GlobalContext);

  const handleAddressClick = () => {
    const address = plainWallet?.address;
    if (address) {
      navigator.clipboard
        .writeText(address)
        .catch((e) => {
          throw e;
        })
        .then(() => {
          setSnackbarMessage({
            text: "Address copied to clipboard!",
            type: "info",
          });
        });
    }
  };

  const handlePassphraseClick = () => {
    if (mnemonic) {
      navigator.clipboard
        .writeText(mnemonic)
        .catch((e) => {
          throw e;
        })
        .then(() => {
          setSnackbarMessage({
            text: "Mnemonic copied to clipboard!",
            type: "info",
          });
        });
    }
  };

  return (
    <MainPanel enforceMinHeight>
      <PanelContainer>
        <PanelTitle color="primary" onBackButtonPress={onButtonBack}>
          Your Wallet
        </PanelTitle>
        <PanelContent>
          <PublicAddressContent>
            <InfoBox
              text={plainWallet?.address || ""}
              label={"Your address"}
              onClick={handleAddressClick}
              wordBreak
            >
              <CopyMe>
                <IonIcon icon={copy} />
              </CopyMe>
            </InfoBox>
          </PublicAddressContent>
          <WordsContent inList>
            <Label>Secret words</Label>
            <PhraseBox onClick={handlePassphraseClick}>
              {mnemonic}
              <CopyMe>
                <IonIcon icon={copy} />
              </CopyMe>
            </PhraseBox>
            <InfoBox
              text={
                "Carefully note the 24 words. They are the keys to your wallet."
              }
              Icon={Edit3}
              importance="alert"
            />
          </WordsContent>
        </PanelContent>
        <FooterActions apparitionDelay={0.3}>
          <Button onClick={onButtonNext}>
            {"I've copied the words, continue"}
          </Button>
        </FooterActions>
      </PanelContainer>
    </MainPanel>
  );
};

const CopyMe = styled.div`
  font-weight: 500;
  color: white;
  text-align: right;
  margin: 1rem auto 0 auto;
  text-transform: uppercase;
  opacity: 0.8;
  font-size: 1rem;
  width: 100%;
`;
const Label = styled.label`
  width: 100%;
  padding-left: 15px;
  padding-bottom: 5px;
  color: ${({ theme }) => theme.font.secondary};
  font-weight: 500;
`;

const PublicAddressContent = styled(SectionContent)`
  flex: 0;
  justify-content: flex-start;
`;

const WordsContent = styled(SectionContent)`
  justify-content: flex-start;
`;

const PhraseBox = styled.div`
  width: 100%;
  padding: 20px;
  color: ${({ theme }) => "white"};
  font-weight: bold;
  font-size: 1rem;
  text-align: center;
  background-color: ${({ theme }) => theme.global.alert};
  border-radius: 7px;
  margin-bottom: 20px;
`;

export default WalletWordsPage;
