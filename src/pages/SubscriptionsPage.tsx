import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import QRCode from "qrcode.react";
import { useContext, useEffect, useState } from "react";

import styled from "styled-components";
import { GlobalContext } from "../App";
import AppHeader from "../components/AppHeader";
import { PanelContainer, SectionContent } from "../components/PageComponents";
import {
  deleteSubscription,
  getSubscriptions,
  Subscription,
} from "../services/subscriptions";
import InvoiceHistory from "../components/InvoiceHistory";
import SubscriptionElement from "../components/Subscription";
import { Button } from "../components/Buttons";
import { useHistory } from "react-router";

const SubscriptionsPage = () => {
  const { jwtToken } = useContext(GlobalContext);
  const history = useHistory();
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(
    null
  );

  const [subscriptionsOpened, setSubscriptionsOpened] = useState<any>({});

  useEffect(() => {
    if (jwtToken) {
      getSubscriptions(jwtToken)
        .then((data) => {
          setSubscriptions(data.data);
        })
        .catch((reason) => {
          console.log("ERROR", reason);
        });
    }
  }, [jwtToken]);

  const cancelSubscription = (subscription: Subscription) => {
    if (jwtToken) {
      if (window.confirm("Do you really want to cancel this subscription?")) {
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

  const isOpen = (subscription: Subscription): boolean => {
    return !!subscriptionsOpened[subscription._id];
  };

  const switchHistory = (subscription: Subscription) => {
    let updatedHistory = { ...subscriptionsOpened };
    updatedHistory[subscription._id] = !updatedHistory[subscription._id];
    setSubscriptionsOpened(updatedHistory);
  };

  const goToPlanSelection = () => {
    history.push("/choose-plan");
  };

  return (
    <IonPage className="internal-page">
      <h1 className="page-title">Your subscriptions</h1>
      <p className="page-subtitle">
        Below, you will find your subscription history and the invoices.
      </p>

      <Button className="btn-centered" onClick={goToPlanSelection}>
        <i className="icon-pick-axe pr-2"></i> Start mining in the cloud
      </Button>

      {subscriptions &&
        subscriptions.length > 0 &&
        subscriptions.map((subscription) => {
          return (
            <SubscriptionElement
              subscription={subscription}
              showInvoices={isOpen(subscription)}
              switchDisplayInvoices={() => switchHistory(subscription)}
              cancelSubscription={() => cancelSubscription(subscription)}
            ></SubscriptionElement>
          );
        })}
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
