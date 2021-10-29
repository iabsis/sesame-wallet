import React, { useCallback, useContext, useState } from "react";
import styled, { useTheme } from "styled-components";

import { ReactComponent as MountainSVG } from "../images/mountain.svg";
import { ReactComponent as AtmosphericGlow } from "../images/athmospheric_glow.svg";
import { motion } from "framer-motion";
import { Form, Input, Select } from "../components/Inputs";
import { Button } from "../components/Buttons";
import tinycolor from "tinycolor2";
import {
  MainPanel,
  PanelTitle,
  SectionContent,
} from "../components/PageComponents";
import { useHistory } from "react-router";
import Paragraph, { CenteredSecondaryParagraph } from "../components/Paragraph";
import { walletOpen, getStorage } from "alephium-js";
import { GlobalContext } from "../App";
import { Settings as SettingsIcon } from "lucide-react";
import alephiumLogo from "../images/alephium_logo.svg";
import { deviceBreakPoints } from "../style/globalStyles";
import AppHeader from "../components/AppHeader";
import { AskForBiometric } from "../components/AskForBiometric";
import {
  disableBiometricFor,
  getBiometricPasswordFor,
  isBiometricAskedForWallet,
  isBiometricEnabledForWallet,
} from "../services/fingerprints";

import fingerprint from "../images/fingerprint.svg";

interface HomeProps {
  hasWallet: boolean;
  usernames: string[];
  networkId: number;
}

const Storage = getStorage();

const HomePage = ({ hasWallet, usernames, networkId }: HomeProps) => {
  const history = useHistory();
  const [showActions, setShowActions] = useState(false);
  const theme = useTheme();

  const renderActions = () => (
    <InitialActions hasWallet={hasWallet} setShowActions={setShowActions} />
  );

  return (
    <HomeContainer>
      <AppHeader>
        <SettingsButton
          transparent
          squared
          onClick={() => history.push("/settings")}
        >
          <SettingsIcon />
        </SettingsButton>
      </AppHeader>

      <InteractionArea>
        <MainPanel verticalAlign="center" horizontalAlign="center">
          {showActions ? (
            <>
              <PanelTitle useLayoutId={false}>New account</PanelTitle>
              {renderActions()}
            </>
          ) : hasWallet ? (
            <>
              <PanelTitle useLayoutId={false}>Welcome back!</PanelTitle>
              <CenteredSecondaryParagraph>
                Please choose an account and enter your password to continue.
              </CenteredSecondaryParagraph>
              <Login
                setShowActions={setShowActions}
                usernames={usernames}
                networkId={networkId}
              />
            </>
          ) : (
            <>
              <PanelTitle useLayoutId={false}>Welcome!</PanelTitle>
              {renderActions()}
            </>
          )}
        </MainPanel>
      </InteractionArea>
    </HomeContainer>
  );
};

// === Components

const Login = ({
  usernames,
  setShowActions,
}: {
  usernames: string[];
  networkId: number;
  setShowActions: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const {
    setWallet,
    setCurrentUsername,
    setSnackbarMessage,
    isFingerPrintAvailable,
  } = useContext(GlobalContext);
  const history = useHistory();

  const [askForBiometric, setAskForBiometric] = useState(false);

  const login = async (
    callback: (
      wallet: any,
      credentials: { username: string; password: string }
    ) => void,
    password?: string | null
  ) => {
    let walletEncrypted = null;

    if (!credentials.username) {
      setSnackbarMessage({
        text: "Please select the wallet to open first",
        type: "alert",
      });
    } else {
      walletEncrypted = Storage.load(credentials.username);
    }
    if (walletEncrypted === null) {
      setSnackbarMessage({ text: "Unknown account name", type: "info" });
    } else {
      try {
        const wallet = await walletOpen(
          password ? password : credentials.password,
          walletEncrypted
        );
        if (wallet) {
          setWallet(wallet);
          setCurrentUsername(credentials.username);
          callback(wallet, credentials);
        }
      } catch (e) {
        setSnackbarMessage({ text: "Invalid password", type: "alert" });
      }
    }
  };

  const handleCredentialsChange = useCallback(
    (type: "username" | "password", value: string) => {
      setCredentials((prev) => ({ ...prev, [type]: value }));
    },
    []
  );

  const handleLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    login((wallet, credentials) => {
      const bioOn = isBiometricEnabledForWallet(credentials.username);
      const bioAsked = isBiometricAskedForWallet(credentials.username);
      if (!isFingerPrintAvailable || bioAsked) {
        history.push("/wallet");
      } else {
        setAskForBiometric(true);
      }
    });
  };

  const loginWithFingerprint = () => {
    getBiometricPasswordFor(credentials.username)
      .then((password: string | null) => {
        console.log("GOT PASSWORD", password);
        login(() => {
          history.push("/wallet");
        }, password);
      })
      .catch((err) => {
        console.log("ERR", err);
        setSnackbarMessage({
          text: "Unable to unlock. Please use your password",
          type: "alert",
        });
        // disableBiometricFor(credentials.username);
      });
  };

  return (
    <>
      {askForBiometric && (
        <AskForBiometric
          finished={(choice: boolean) => {
            setAskForBiometric(false);
            history.push("/wallet");
          }}
          success={() => {
            setSnackbarMessage({
              text: "Your wallet is now unloackable from your fingerprint",
              type: "success",
            });
          }}
          failure={() => {
            setSnackbarMessage({
              text: "Sorry, we were unable to enable fingerprint access for your wallet",
              type: "alert",
            });
          }}
          walletName={credentials.username}
          walletPassword={credentials.password}
        />
      )}
      <Form>
        <SectionContent inList>
          <Select
            placeholder="Account name"
            options={usernames.map((u) => ({ label: u, value: u }))}
            onValueChange={(value) =>
              handleCredentialsChange("username", value?.value || "")
            }
          />
          <Input
            placeholder="Password"
            type="password"
            autoComplete="off"
            onChange={(e) =>
              handleCredentialsChange("password", e.target.value)
            }
            value={credentials.password}
            endButton={
              isBiometricEnabledForWallet(credentials.username) && (
                <img
                  src={fingerprint}
                  className="fingerprint-button"
                  onClick={loginWithFingerprint}
                />
              )
            }
          />
        </SectionContent>
        <SectionContent inList>
          <Button onClick={handleLogin} type="submit">
            Login
          </Button>
        </SectionContent>
      </Form>

      <SwitchLink onClick={() => setShowActions(true)}>
        Create / import a new wallet
      </SwitchLink>
    </>
  );
};

const InitialActions = ({
  hasWallet,
  setShowActions,
}: {
  hasWallet: boolean;
  setShowActions: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const history = useHistory();
  const { isFingerPrintAvailable } = useContext(GlobalContext);

  return (
    <>
      <CenteredSecondaryParagraph>
        Please choose wether you want to create or new wallet, or import an
        existing one.
      </CenteredSecondaryParagraph>
      <SectionContent inList>
        <Button marginBottom onClick={() => history.push("/create")}>
          New wallet
        </Button>
        <Button onClick={() => history.push("/import")}>Import wallet</Button>

        {hasWallet && (
          <SwitchLink onClick={() => setShowActions(false)}>
            Use an existing account
          </SwitchLink>
        )}
      </SectionContent>
    </>
  );
};

// === Styling

const HomeContainer = styled.main`
  display: flex;
  flex: 1;

  @media ${deviceBreakPoints.mobile} {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  flex: 0.5;
  min-width: 300px;
  background-color: ${({ theme }) => theme.bg.contrast};
  position: relative;
  overflow: hidden;
  padding: 3vw;

  @media ${deviceBreakPoints.mobile} {
    flex: 0.8;
    min-width: initial;
    display: flex;
    align-items: center;
  }
`;

const IllustrationsContainer = styled.div`
  @media ${deviceBreakPoints.mobile} {
    display: none;
  }
`;

const AtmosphericGlowBackground = styled(motion(AtmosphericGlow))`
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  height: 300px;
  transform: scale(3.5) translateY(25%);
  opacity: 0.6;

  @media ${deviceBreakPoints.mobile} {
    transform: scale(3.5) translateY(35%);
  }
`;

const InteractionArea = styled.div`
  flex: 1.5;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 25px;
`;

const HeaderText = styled.div`
  margin-top: 5vh;
  max-width: 700px;
  color: ${({ theme }) => theme.font.contrastSecondary};

  @media ${deviceBreakPoints.mobile} {
    display: none;
  }
`;

const PageSubtitle = styled.h3`
  margin-top: 5px;
`;

const Moon = styled(motion.div)`
  position: absolute;
  right: 25%;
  height: 10vw;
  width: 10vw;
  max-height: 60px;
  max-width: 60px;
  border-radius: 200px;
  background-color: ${({ theme }) => theme.global.secondary};
`;

const MountainImage = styled(MountainSVG)`
  position: absolute;
  width: 70%;
  height: 25%;
  bottom: -2px;

  path {
    fill: #1a0914;
  }
`;

const CloudGroup = ({
  coordinates,
  lengths,
  side,
  distance,
  style,
}: {
  coordinates: [string, string][];
  lengths: string[];
  side: "right" | "left";
  distance: string;
  style?: React.CSSProperties | undefined;
}) => {
  const clouds = [];

  for (let i = 0; i < coordinates.length; i++) {
    clouds.push(
      <Cloud
        key={i}
        style={{
          left: coordinates[i][0],
          top: coordinates[i][1],
          width: lengths[i],
        }}
      />
    );
  }

  return (
    <StyledCloudGroup
      initial={{ [side]: "-100px" }}
      animate={{ [side]: distance }}
      transition={{ delay: 0.1, duration: 0.5 }}
      style={style}
    >
      {clouds}
    </StyledCloudGroup>
  );
};

const StyledCloudGroup = styled(motion.div)`
  height: 50px;
  width: 100px;
  position: absolute;
`;

const Cloud = styled.div`
  position: absolute;
  background-color: ${({ theme }) =>
    tinycolor(theme.global.secondary).setAlpha(0.3).toString()};
  height: 3px;
`;

export const SwitchLink = styled(Paragraph)`
  color: ${({ theme }) => theme.global.accent};
  background-color: ${({ theme }) => theme.bg.primary};
  padding: 5px;
  cursor: pointer;

  &:hover {
    color: ${({ theme }) =>
      tinycolor(theme.global.accent).darken(10).toString()};
  }
`;

const AlephiumLogo = styled.div`
  background-image: url(${alephiumLogo});
  background-repeat: no-repeat;
  background-position: center;
  height: 10vh;
  width: 10vw;
  margin-top: 20px;
  max-width: 60px;
  min-width: 30px;

  @media ${deviceBreakPoints.mobile} {
    margin: auto;
    max-width: 80px;
    width: 15vw;
    height: 15vh;
    z-index: 1;
  }
`;

const SettingsButton = styled(Button)``;

export default HomePage;
