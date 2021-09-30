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
import { ChoosePlanContext } from "./ChoosePlanContext";
import { checkout } from "../../services/checkout";
import { Browser } from "@capacitor/browser";

import creditCard from "../../images/credit_card_path.svg";
import { useHistory } from "react-router";

const ChoosePlanCheckoutPage = () => {
  const { setContext, planObject, nbSlots } = useContext(ChoosePlanContext);
  const history = useHistory();

  const { onButtonBack, onButtonNext } = useContext(StepsContext);
  const { jwtToken, setJwtToken } = useContext(GlobalContext);

  const [sessionError, setSessionError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const redirectToDashboard = () => {
    history.push("/wallet/dashboard");
  };

  const generateUrl = () => {
    if (jwtToken && planObject && nbSlots) {
      setSessionError(false);
      setLoading(true);
      checkout(planObject._id, nbSlots, jwtToken)
        .then((checkoutUrl) => {
          Browser.open({ url: checkoutUrl.data.url });
          console.log("THERE IS NO ERROR");
          setSessionError(false);
        })
        .catch((err) => {
          console.log("THERE IS AN ERROR");
          setSessionError(true);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    generateUrl();
  }, []);

  return (
    <MainPanel>
      <PanelContainer>
        <PanelTitle color="primary">Checkout</PanelTitle>
        <PanelContent>
          You are about to be redirected to your browser in order to pay with
          Stripe.
        </PanelContent>
        <img src={creditCard} className="credit-card" />
        <FooterActions apparitionDelay={0.3}>
          {sessionError ? (
            <Button disabled={loading} onClick={() => generateUrl()}>
              Try again
            </Button>
          ) : (
            <Button disabled={loading} onClick={() => redirectToDashboard()}>
              Go back to dashboard
            </Button>
          )}
        </FooterActions>
      </PanelContainer>
    </MainPanel>
  );
};

const Price = styled(Paragraph)`
  text-align: center;
  color: ${({ theme }) => theme.font.secondary};
  margin-bottom: 0;
`;

export default ChoosePlanCheckoutPage;
