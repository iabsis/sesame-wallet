import { ChangeEvent, useState, useContext, useEffect } from "react";
import { PanelContainer, SectionContent, FooterActions, PanelTitle, MainPanel, PanelContent } from "../../components/PageComponents";

import styled from "styled-components";
import Paragraph from "../../components/Paragraph";
import { Button } from "../../components/Buttons";
import { GlobalContext } from "../../App";
import { StepsContext } from "../MultiStepsController";
import { ChoosePlanContext } from "./ChoosePlanContext";
import { getPlans, Plan } from "../../services/plans";
import { getSlotsAvailable } from "../../services/slots";
import PlanElement from "./Plan";
import { IonPage, IonRange, useIonAlert } from "@ionic/react";
import StepDescription from "../../components/StepDescription";
import { useHistory } from "react-router";
import { authenticate } from "../../services/auth";

import serverError from "../../images/server-error.svg";
import { Input } from "../../components/Inputs";

const ChoosePlanPage = () => {
  const { setContext, planObject: existingPlan, nbSlots: existingNbSlots } = useContext(ChoosePlanContext);
  const { onButtonNext } = useContext(StepsContext);
  const { setMyReferral, setJwtToken, wallet } = useContext(GlobalContext);

  const [state, setState] = useState<{
    planObject: Plan | null;
    planObjectError: string;
    nbSlots: number;
    nbSlotsError: string;
  }>({
    planObject: existingPlan,
    planObjectError: "",
    nbSlots: existingNbSlots,
    nbSlotsError: "",
  });
  const { planObject, nbSlots } = state;
  const history = useHistory();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [referral, setReferral] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<{ min: number; max: number; remaining: number | null; total: number }>({
    min: 1,
    max: 10,
    remaining: null,
    total: 0,
  });

  const [present] = useIonAlert();

  // Is next button activated?
  const isNextButtonActive = () => nbSlots > 0 && planObject && planObject._id;

  const handleNextButtonClick = () => {
    present({
      header: "Important",
      message: "Remember that subscriptions are auto renewed. You will be able to cancel auto renew from the subscriptions tab once paid.",
      buttons: [
        "Cancel",
        {
          text: "Proceed",
          handler: (d) => {
            setContext((prevContext) => ({ ...prevContext, planObject, nbSlots, referral }));
            onButtonNext();
          },
        },
      ],
      onDidDismiss: (e) => console.log("did dismiss"),
    });
  };

  const redirectToDashboard = () => {
    history.push("/wallet/dashboard");
  };

  useEffect(() => {
    if (wallet) {
      authenticate(wallet)
        .then((data) => {
          setJwtToken(data.data.token);
          setMyReferral(data.data.referral);
          getSlotsAvailable(data.data.token).then((slot) => {
            setAvailableSlots({ min: slot.data.min, max: slot.data.max, remaining: slot.data.remaining, total: slot.data.total });
          });
          getPlans(data.data.token).then((plans) => {
            setPlans(plans.data);
          });
        })

        .catch((err) => {});
    } else {
      history.push("/wallet/dashboard");
    }
  }, []);

  const goToWhitelist = () => {
    window.open("https://docs.google.com/forms/d/e/1FAIpQLSdWIMC7-z-i5fdFWdT021QnAkvHFQuQlWfbf1W7OsUirnnBGg/viewform", "_system");
  };

  const renderWaitingList = () => {
    return (
      <div className="centered">
        <h1 className="page-title">Sorry! No remaining slots available</h1>
        <img src={serverError} className="white-full-screen-icon" />
        <p className="page-subtitle">
          The whole {availableSlots.total} slots available on our cloud are already booked. You can apply for the new slots below.{" "}
        </p>
        <Button onClick={() => goToWhitelist()} type="button">
          Apply for new slots
        </Button>
      </div>
    );
  };

  const handleReferralChange = (e: ChangeEvent<HTMLInputElement>) => {
    setReferral(e.target.value);
  };

  const renderPlans = () => {
    return (
      <>
        <StepDescription step={1} text="Choose a plan"></StepDescription>
        {plans.length > 0 &&
          plans.map((currentPlan) => {
            return (
              <PlanElement
                plan={currentPlan}
                selected={!!(planObject && planObject._id === currentPlan._id)}
                onClick={() => {
                  setState({ ...state, planObject: currentPlan });
                }}
                key={currentPlan._id}
              />
            );
          })}
        <p className="important-msg t-center">Tokens are distributed every Monday to reduce gas fees.</p>
        {planObject && (
          <>
            <StepDescription step={2} text="How much slots do you want?"></StepDescription>
            <IonRange
              mode="md"
              min={availableSlots.min}
              max={availableSlots.max}
              pin={true}
              value={nbSlots}
              className="marged-range"
              onIonChange={(e) => setState({ ...state, nbSlots: e.detail.value as number })}
            />
            {nbSlots > 0 && <div className="nb-slots">{nbSlots} slot(s)</div>}
            <StepDescription
              step={3}
              text="Referral"
              subtitle="Put the referral alephium address. You and your referal will both get rewards."
            ></StepDescription>

            <div className="margin">
              <Input value={referral} placeholder="Referral (optional)" type="text" autoComplete="off" onChange={handleReferralChange} />
            </div>
          </>
        )}

        <FooterActions apparitionDelay={0.3}>
          <Button disabled={!isNextButtonActive()} onClick={handleNextButtonClick} className="mb">
            {planObject ? `Pay ${(nbSlots * planObject.pricePerSlot).toFixed(2)} CHF with stripe` : "Continue"}
          </Button>
        </FooterActions>
      </>
    );
  };

  return (
    <IonPage className="page-padding">
      <button className="global-close" onClick={() => redirectToDashboard()}>
        &times;
      </button>
      {availableSlots.remaining === 0 && renderWaitingList()}
      {plans.length > 0 && availableSlots.remaining !== 0 && renderPlans()}
    </IonPage>
  );
};

const Price = styled(Paragraph)`
  text-align: center;
  color: ${({ theme }) => theme.font.secondary};
  margin-bottom: 0;
`;

export default ChoosePlanPage;
