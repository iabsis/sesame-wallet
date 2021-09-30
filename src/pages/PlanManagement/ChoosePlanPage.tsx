import { ChangeEvent, useState, useContext, useEffect } from "react";
import {
  PanelContainer,
  SectionContent,
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
import { getPlans, Plan } from "../../services/plans";
import PlanElement from "./Plan";
import { IonItem, IonPage, IonRange } from "@ionic/react";
import StepDescription from "../../components/StepDescription";
import { useHistory } from "react-router";

const ChoosePlanPage = () => {
  const {
    setContext,
    planObject: existingPlan,
    nbSlots: existingNbSlots,
  } = useContext(ChoosePlanContext);
  const { onButtonBack, onButtonNext } = useContext(StepsContext);

  const { jwtToken, setJwtToken } = useContext(GlobalContext);

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

  // Is next button activated?
  const isNextButtonActive = () => nbSlots > 0 && planObject && planObject._id;

  const handleNextButtonClick = () => {
    setContext((prevContext) => ({ ...prevContext, planObject, nbSlots }));
    onButtonNext();
  };

  const redirectToDashboard = () => {
    history.push("/wallet/dashboard");
  };

  useEffect(() => {
    if (jwtToken) {
      getPlans(jwtToken)
        .then((plans) => {
          setPlans(plans.data);
        })
        .catch((err) => {});
    }
  }, []);

  return (
    <IonPage className="page-padding">
      <button className="global-close" onClick={() => redirectToDashboard()}>
        &times;
      </button>
      <StepDescription step={1} text="Choose a plan"></StepDescription>
      {console.log("plans", plans)}
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

      {planObject && (
        <>
          <StepDescription
            step={2}
            text="How much slots do you want?"
          ></StepDescription>
          <IonRange
            mode="md"
            min={1}
            max={10}
            pin={true}
            value={nbSlots}
            onIonChange={(e) =>
              setState({ ...state, nbSlots: e.detail.value as number })
            }
          />
        </>
      )}

      <FooterActions apparitionDelay={0.3}>
        <Button
          disabled={!isNextButtonActive()}
          onClick={handleNextButtonClick}
        >
          {planObject
            ? `Pay ${(nbSlots * planObject.pricePerSlot).toFixed(
                2
              )} CHF with stripe`
            : "Continue"}
        </Button>
      </FooterActions>
    </IonPage>
  );
};

const Price = styled(Paragraph)`
  text-align: center;
  color: ${({ theme }) => theme.font.secondary};
  margin-bottom: 0;
`;

export default ChoosePlanPage;
