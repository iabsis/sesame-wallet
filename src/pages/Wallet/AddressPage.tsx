import {
  PanelContainer,
  SectionContent,
} from "../../components/PageComponents";
import QRCode from "qrcode.react";
import { useContext } from "react";
import { GlobalContext } from "../../App";
import Paragraph from "../../components/Paragraph";
import { openInNewWindow } from "../../utils/misc";
import { loadSettingsOrDefault } from "../../utils/clients";
import { Button } from "../../components/Buttons";
import styled from "styled-components";
import { Clipboard } from "@capacitor/clipboard";

const AddressPage = () => {
  const { wallet, setSnackbarMessage } = useContext(GlobalContext);

  const address = wallet?.address;

  const handleShowInExplorer = () => {
    const { explorerUrl } = loadSettingsOrDefault();
    if (explorerUrl) {
      const cleanURL = `${explorerUrl}/#/addresses/${address}`.replace(
        /([^:]\/)\/+/g,
        "$1"
      ); // Remove forward slashes duplicates if needed
      openInNewWindow(cleanURL);
    }
  };

  const handleCopy = () => {
    if (address) {
      Clipboard.write({ string: address })
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

  return (
    <PanelContainer>
      <SectionContent>
        {address && <QRCode value={address} style={{ marginTop: 25 }} />}
      </SectionContent>
      <ShortenParagraph>{address}</ShortenParagraph>
      <SectionContent inList>
        <Button secondary onClick={handleShowInExplorer}>
          Show in explorer
        </Button>
        <Button secondary onClick={handleCopy}>
          Copy address
        </Button>
      </SectionContent>
    </PanelContainer>
  );
};

const ShortenParagraph = styled(Paragraph)`
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
  margin-top: 50px;
`;

export default AddressPage;
