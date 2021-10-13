import { useState, useContext, useEffect } from "react";
import {
  PanelContainer,
  FooterActions,
  PanelTitle,
  MainPanel,
  PanelContent,
} from "../../components/PageComponents";
import styled from "styled-components";
import Paragraph from "../../components/Paragraph";
import { Button } from "../../components/Buttons";
import { GlobalContext } from "../../App";
import { StepsContext } from "../MultiStepsController";
import { checkout } from "../../services/checkout";
import { Browser } from "@capacitor/browser";

import { useHistory } from "react-router";

const PaymentFailed = () => {
  const history = useHistory();

  const { onButtonBack, onButtonNext } = useContext(StepsContext);
  const { jwtToken, setJwtToken } = useContext(GlobalContext);

  const [sessionError, setSessionError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const redirectToDashboard = () => {
    history.push("/wallet/dashboard");
  };

  return (
    <MainPanel>
      <PanelContainer>
        <PanelTitle color="primary">Payment failed</PanelTitle>
        <PanelContent>
          Your payment failed.
        </PanelContent>
        <FooterActions apparitionDelay={0.3}>
            <Button disabled={loading} onClick={() => redirectToDashboard()}>
              Go back to dashboard
            </Button>
        </FooterActions>
      </PanelContainer>
    </MainPanel>
  );
};


export default PaymentFailed;