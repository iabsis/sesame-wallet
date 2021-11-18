import { useState, useContext, useEffect } from "react";
import { PanelContainer, FooterActions, PanelTitle, MainPanel, PanelContent } from "../../components/PageComponents";
import styled from "styled-components";
import Paragraph from "../../components/Paragraph";
import { Button } from "../../components/Buttons";
import { GlobalContext } from "../../App";
import { StepsContext } from "../MultiStepsController";
import { checkout } from "../../services/checkout";
import { Browser } from "@capacitor/browser";

import { useHistory } from "react-router";

const PaymentSuccess = () => {
  const history = useHistory();

  const redirectToDashboard = () => {
    history.push("/wallet/dashboard");
  };

  return (
    <MainPanel>
      <PanelContainer>
        <PanelTitle color="primary">Payment successfull</PanelTitle>
        <PanelContent>Your payment was succeed, please allow 15 to 30 minutes before you will get your first reward on your wallet.</PanelContent>
        <FooterActions apparitionDelay={0.3}>
          <Button onClick={() => redirectToDashboard()}>Go back to dashboard</Button>
        </FooterActions>
      </PanelContainer>
    </MainPanel>
  );
};

export default PaymentSuccess;
