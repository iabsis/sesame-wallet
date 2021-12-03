import { IonPage } from "@ionic/react";
import QRCode from "qrcode.react";
import { useContext, useEffect, useState } from "react";

import styled from "styled-components";
import { GlobalContext } from "../App";
import { deleteSubscription, getSubscriptions, Subscription } from "../services/subscriptions";
import { Booking, getBookings } from "../services/bookings";
import SubscriptionElement from "../components/Subscription";
import BookingElement from "../components/Booking";
import { Button } from "../components/Buttons";
import { useHistory } from "react-router";
import StepDescription from "../components/StepDescription";

const SubscriptionsPage = () => {
  const { jwtToken } = useContext(GlobalContext);
  const history = useHistory();
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  const [subscriptionsOpened, setSubscriptionsOpened] = useState<any>({});

  /**
   * Retrieve user subscriptions and bookings whenever the jwt token is refreshing
   */
  useEffect(() => {
    if (jwtToken) {
      getSubscriptions(jwtToken)
        .then((data) => {
          setSubscriptions(data.data);
        })
        .catch((reason) => {
          console.log("ERROR", reason);
        });
      getBookings(jwtToken)
        .then((data) => {
          setBookings(data.data);
        })
        .catch((reason) => {
          console.log("ERROR", reason);
        });
    }
  }, [jwtToken]);

  /**
   * Display the confirmation box to cancel a subscription
   * @param subscription
   */
  const cancelSubscription = (subscription: Subscription) => {
    if (jwtToken) {
      if (
        window.confirm(
          "You are about to cancel auto renewal of the subscription. You will continue to receive tokens until the end of the subscription. Do you confirm?"
        )
      ) {
        deleteSubscription(jwtToken, subscription)
          .then(() => {
            let subscriptionAfterDelete = subscriptions
              ? subscriptions.map((currentSub) => {
                  if (currentSub._id === subscription._id) {
                    currentSub.renewal = false;
                  }
                  return currentSub;
                })
              : [];
            setSubscriptions(subscriptionAfterDelete);
          })
          .catch(() => console.log("ERROR while deleting"));
      }
    }
  };

  /**
   * Return the status of the invoices history display
   * @param subscription
   * @returns
   */
  const isOpen = (subscription: Subscription): boolean => {
    return !!subscriptionsOpened[subscription._id];
  };

  /**
   * Function to allow user to show / hide the display of the invoices for a specific subscription
   * @param subscription
   */
  const switchHistory = (subscription: Subscription) => {
    let updatedHistory = { ...subscriptionsOpened };
    updatedHistory[subscription._id] = !updatedHistory[subscription._id];
    setSubscriptionsOpened(updatedHistory);
  };

  /**
   * Return the view of the subscription (if any)
   * @returns
   */
  const displayRenewableSubscriptions = () => {
    if (!subscriptions || subscriptions.length < 1) {
      return <></>;
    }
    return (
      <>
        <StepDescription text="Your subscriptions" className="space-top"></StepDescription>
        {subscriptions.map((subscription) => {
          return (
            <SubscriptionElement
              subscription={subscription}
              showInvoices={isOpen(subscription)}
              switchDisplayInvoices={() => switchHistory(subscription)}
              cancelSubscription={() => cancelSubscription(subscription)}
            ></SubscriptionElement>
          );
        })}
      </>
    );
  };

  /**
   * Return the view of the bookings (if any)
   * @returns
   */
  const displayBookings = () => {
    if (!bookings || bookings.length < 1) {
      return <></>;
    }
    return (
      <>
        <StepDescription text="Your booked slots" className="space-top"></StepDescription>
        {bookings.map((booking) => {
          return <BookingElement booking={booking}></BookingElement>;
        })}
      </>
    );
  };

  /**
   * Redirect the user to the "plan selection" page
   */
  const goToPlanSelection = () => {
    history.push("/choose-plan");
  };

  return (
    <IonPage className="internal-page">
      <h1 className="page-title">Your subscriptions</h1>
      <p className="page-subtitle">Below, you will find your subscription history and the invoices.</p>

      <Button className="btn-centered" onClick={goToPlanSelection}>
        <i className="icon-pick-axe pr-2"></i> Start mining in the cloud
      </Button>

      {displayRenewableSubscriptions()}
      {displayBookings()}
    </IonPage>
  );
};

const CardDetail = styled.div`
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  z-index: 1;
`;

const CardDetailName = styled.div``;

const CardDetailDescription = styled.div``;

export default SubscriptionsPage;
