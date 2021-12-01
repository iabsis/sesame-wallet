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
import { getPrebookableSlots, PrebookableSlot } from "../../services/slotsPrebooking";
import PrebookableSlotElement from "./PrebookableSlot";
import { IonIcon, IonPage, IonRange, useIonAlert } from "@ionic/react";
import StepDescription from "../../components/StepDescription";
import { useHistory } from "react-router";
import { authenticate } from "../../services/auth";

import serverError from "../../images/server-error.svg";
import { Input } from "../../components/Inputs";
import dayjs from "dayjs";
import { arrowBack } from "ionicons/icons";

const ChoosePlanPage = () => {
  const { setContext, prebookableSlotObject: prebookableSlot, nbSlots: existingNbSlots } = useContext(ChoosePlanContext);
  const { onButtonNext } = useContext(StepsContext);
  const { setMyReferral, setJwtToken, wallet } = useContext(GlobalContext);

  const [state, setState] = useState<{
    prebookableSlotObject: PrebookableSlot | null;
    prebookableSlotObjectError: string;
    nbSlots: number;
    nbSlotsError: string;
  }>({
    prebookableSlotObject: prebookableSlot,
    prebookableSlotObjectError: "",
    nbSlots: existingNbSlots,
    nbSlotsError: "",
  });
  const { prebookableSlotObject, nbSlots } = state;
  const history = useHistory();

  const [prebookableSlots, setPrebookableSlots] = useState<PrebookableSlot[]>([]);
  const [referral, setReferral] = useState<string>("");

  // Is next button activated?
  const isNextButtonActive = () => nbSlots > 0 && prebookableSlotObject && prebookableSlotObject.date;

  const handleNextButtonClick = () => {
    setContext((prevContext) => ({ ...prevContext, prebookableSlotObject, nbSlots, referral }));
    onButtonNext();
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

          getPrebookableSlots(data.data.token).then((slots) => {
            setPrebookableSlots(slots.data);
          });
        })

        .catch((err) => {});
    } else {
      history.push("/wallet/dashboard");
    }
  }, []);

  const renderPrebookableSlots = () => {
    return (
      <div className={`sliding-page ${prebookableSlotObject ? "step-2" : "step-1"}`}>
        <div className={`step-1`}>
          <StepDescription step={1} text="Choose the mining period"></StepDescription>
          {prebookableSlots.length > 0 &&
            prebookableSlots.map((currentPrebookableSlot) => {
              return (
                <PrebookableSlotElement
                  prebookableSlot={currentPrebookableSlot}
                  onClick={() => {
                    setState({ ...state, prebookableSlotObject: currentPrebookableSlot });
                  }}
                  key={currentPrebookableSlot.date.getTime()}
                />
              );
            })}
        </div>

        <div className={`step-2`}>
          <>
            <button
              onClick={() => {
                setState({ ...state, prebookableSlotObject: null, nbSlots: 0 });
              }}
              className="back-button margin"
            >
              <IonIcon icon={arrowBack}></IonIcon> Select another month
            </button>
            <StepDescription step={2} text="How much slots do you want?"></StepDescription>
            <p className="margin">
              {prebookableSlotObject ? (
                <>
                  Please select below the number of slots you want to book for{" "}
                  <strong className="accent">{dayjs(prebookableSlotObject.date).format("MMMM YY")}</strong>
                </>
              ) : (
                <>You did not select any month</>
              )}
            </p>
            <IonRange
              mode="md"
              min={prebookableSlotObject ? prebookableSlotObject.min_slots : 0}
              max={prebookableSlotObject ? prebookableSlotObject.max_slots : 0}
              pin={true}
              value={nbSlots}
              className="marged-range"
              onIonChange={(e) => setState({ ...state, nbSlots: e.detail.value as number })}
            />
            {nbSlots > 0 && <div className="nb-slots">{nbSlots} slot(s)</div>}
            <FooterActions apparitionDelay={0.3}>
              <Button disabled={!isNextButtonActive()} onClick={handleNextButtonClick} className="mb">
                {prebookableSlotObject ? `Pay ${(nbSlots * prebookableSlotObject.price_per_slot).toFixed(2)} CHF with stripe` : "Continue"}
              </Button>
            </FooterActions>
          </>
        </div>
      </div>
    );
  };

  return (
    <IonPage className="page-padding no-scroll">
      <button className="global-close" onClick={() => redirectToDashboard()}>
        &times;
      </button>
      {prebookableSlots.length > 0 && renderPrebookableSlots()}
    </IonPage>
  );
};

const Price = styled(Paragraph)`
  text-align: center;
  color: ${({ theme }) => theme.font.secondary};
  margin-bottom: 0;
`;

export default ChoosePlanPage;
