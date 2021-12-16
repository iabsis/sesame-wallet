import { ChangeEvent, useState, useContext, useEffect } from "react";
import { PanelContainer, SectionContent, FooterActions, PanelTitle, MainPanel, PanelContent } from "../../components/PageComponents";

import styled from "styled-components";
import Paragraph from "../../components/Paragraph";
import { Button } from "../../components/Buttons";
import Loader from "../../components/Loader";
import CartItem from "../../components/CartItem";
import { GlobalContext } from "../../App";
import { StepsContext } from "../MultiStepsController";
import { ChoosePlanContext } from "./ChoosePlanContext";
import { getPrebookableSlots, PrebookableSlot } from "../../services/slotsPrebooking";
import PrebookableSlotElement from "./PrebookableSlot";
import { IonIcon, IonPage, IonRange } from "@ionic/react";
import StepDescription from "../../components/StepDescription";
import { useHistory } from "react-router";
import { authenticate } from "../../services/auth";
import dayjs from "dayjs";
import { arrowBack } from "ionicons/icons";
import { Cart } from "../../services/checkout";

const ChoosePlanPage = () => {
  const { setContext, prebookableSlotObject: prebookableSlot, nbSlots: existingNbSlots, nbMonths: existingNbMonths } = useContext(ChoosePlanContext);
  const { onButtonNext } = useContext(StepsContext);
  const { setMyReferral, setJwtToken, wallet } = useContext(GlobalContext);

  const [minMonth, setMinMonth] = useState(1);
  const [maxMonth, setMaxMonth] = useState(1);
  const [cart, setCart] = useState<Cart[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [step, setStep] = useState<string>("step-1");

  const [state, setState] = useState<{
    prebookableSlotObject: PrebookableSlot | null;
    prebookableSlotObjectError: string;
    nbSlots: number;
    nbMonths: number;
    nbSlotsError: string;
  }>({
    prebookableSlotObject: prebookableSlot,
    prebookableSlotObjectError: "",
    nbSlots: existingNbSlots,
    nbMonths: existingNbMonths,
    nbSlotsError: "",
  });
  const { prebookableSlotObject, nbSlots, nbMonths } = state;
  const history = useHistory();

  const [prebookableSlots, setPrebookableSlots] = useState<PrebookableSlot[]>([]);
  const [referral, setReferral] = useState<string>("");

  // Is next button activated?
  const isCheckoutButtonActive = () => nbSlots > 0 && prebookableSlotObject && prebookableSlotObject.date;
  const isPaymentButtonActive = () => price && nbSlots > 0 && prebookableSlotObject && prebookableSlotObject.date;

  const handleStripeButtonClick = () => {
    setContext((prevContext) => ({ ...prevContext, prebookableSlotObject, nbSlots, referral, cart, price }));
    onButtonNext();
  };

  const handleCheckoutClick = () => {
    setContext((prevContext) => ({ ...prevContext, prebookableSlotObject, nbSlots, referral }));
    setStep("step-3");
    generateCart();
  };

  const generateCart = () => {
    if (!prebookableSlotObject) {
      setCart([]);
      return;
    }

    let cart = [];
    let used = 0;
    let price = 0;
    for (const slot of prebookableSlots) {
      if (slot.date >= prebookableSlotObject.date) {
        let selected = used < nbMonths && slot.remaining_slots >= nbSlots && slot.max_slots >= nbSlots;
        let cartItem: Cart = {
          dateString: slot.date,
          date: slot.dateObject,
          selected: selected,
          nbSlots,
        };
        if (selected) {
          used++;
          price += slot.price_per_slot * nbSlots;
        }

        cart.push(cartItem);
      }
    }
    setCart(cart);
    setPrice(price);
    console.log(cart);
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
            setPrebookableSlots(
              slots.data.map((slot) => {
                slot.dateObject = dayjs(slot.date).toDate();
                return slot;
              })
            );
          });
        })

        .catch((err) => {});
    } else {
      history.push("/wallet/dashboard");
    }
  }, []);

  useEffect(() => {
    const dateOfStart = prebookableSlotObject?.date;
    if (!dateOfStart) {
      setMaxMonth(0);
      return;
    }

    let maxMonths = 0;
    for (const slot of prebookableSlots) {
      if (slot.date >= prebookableSlotObject.date && slot.remaining_slots >= nbSlots && slot.max_slots >= nbSlots) {
        maxMonths++;
      }
    }
    console.log("Update max months", maxMonths);
    setMaxMonth(maxMonths);
    if (maxMonths < nbMonths) {
      setState({ ...state, nbMonths: maxMonths });
    }
  }, [nbSlots]);

  const renderPrebookableSlots = () => {
    return (
      <div className={`sliding-page ${step}`}>
        <div className={`step-1`}>
          <StepDescription step={1} text="Choose the mining period"></StepDescription>
          <p className="margin t-center">
            <strong className="accent">Why every month has a diffent price?</strong>
            <br /> The monthly price changes depending on the number of days of period (28 days, 30 days, 31 days).
          </p>

          {prebookableSlots.length > 0 &&
            prebookableSlots.map((currentPrebookableSlot) => {
              return (
                <PrebookableSlotElement
                  prebookableSlot={currentPrebookableSlot}
                  onClick={() => {
                    setState({ ...state, prebookableSlotObject: currentPrebookableSlot });
                    setStep("step-2");
                  }}
                  key={currentPrebookableSlot.dateObject?.getTime()}
                />
              );
            })}
        </div>

        <div className={`step-2`}>
          <>
            <button
              onClick={() => {
                setState({ ...state, prebookableSlotObject: null, nbSlots: 0, nbMonths: 0 });
                setStep("step-1");
                setMaxMonth(1);
                setMinMonth(1);
              }}
              className="back-button margin"
            >
              <IonIcon icon={arrowBack}></IonIcon> Select another month
            </button>

            <StepDescription step={2} text="How many slots do you want?"></StepDescription>
            <p className="margin t-center">
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

            <StepDescription step={3} text="How long do you want to mine?"></StepDescription>
            <p className="margin t-center">
              {prebookableSlotObject ? (
                <>
                  How many month would you like to book from <strong className="accent">{dayjs(prebookableSlotObject.date).format("MMMM YY")}</strong>.
                </>
              ) : (
                <>You did not select any month</>
              )}
            </p>
            <IonRange
              mode="md"
              min={minMonth}
              max={maxMonth}
              pin={true}
              value={nbMonths}
              className="marged-range"
              onIonChange={(e) => setState({ ...state, nbMonths: e.detail.value as number })}
            />
            {nbMonths > 0 && <div className="nb-slots">{nbMonths} month(s)</div>}

            <FooterActions apparitionDelay={0.3}>
              <Button disabled={!isCheckoutButtonActive()} onClick={handleCheckoutClick} className="mb">
                Checkout
              </Button>
            </FooterActions>

            {/* <FooterActions apparitionDelay={0.3}>
              <Button disabled={!isNextButtonActive()} onClick={handleNextButtonClick} className="mb">
                {prebookableSlotObject ? `Pay ${(nbSlots * prebookableSlotObject.price_per_slot).toFixed(2)} CHF with stripe` : "Continue"}
              </Button>
            </FooterActions> */}
          </>
        </div>

        <div className={`step-3`}>
          <button
            onClick={() => {
              setStep("step-2");
            }}
            className="back-button margin"
          >
            <IonIcon icon={arrowBack}></IonIcon> Choose other slot(s)
          </button>
          <StepDescription step={1} text="Checkout"></StepDescription>
          <p className="margin t-center">Please acknowledge the resume of your booking before to proceed to the stripe payment.</p>
          <div className="cart-items">{cart && cart.map((cartItem) => <CartItem selected={cartItem.selected} month={cartItem.date} nbSlots={nbSlots} />)}</div>
          <FooterActions apparitionDelay={0.3}>
            <Button disabled={!isPaymentButtonActive()} onClick={handleStripeButtonClick} className="mb">
              {prebookableSlotObject ? `Pay ${price.toFixed(2)} CHF with stripe` : "Continue"}
            </Button>
          </FooterActions>
        </div>
      </div>
    );
  };

  return (
    <IonPage className="page-padding no-scroll">
      <button className="global-close" onClick={() => redirectToDashboard()}>
        <div className="btn-title">Back to dashboard</div>
        <div className="icon">&times;</div>
      </button>
      {prebookableSlots.length > 0 ? renderPrebookableSlots() : <Loader title="Loading in progress..." />}
    </IonPage>
  );
};

const Price = styled(Paragraph)`
  text-align: center;
  color: ${({ theme }) => theme.font.secondary};
  margin-bottom: 0;
`;

export default ChoosePlanPage;
