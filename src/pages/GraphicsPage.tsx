import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonGrid, IonPage, IonRow } from "@ionic/react";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../App";
import PricingHistory from "../components/Graph/PricingHistory";
import MiningHistory from "../components/Graph/MiningHistory";

import dayjs from "dayjs";
import { getSlotsAvailable } from "../services/slots";
var advancedFormat = require("dayjs/plugin/advancedFormat");
dayjs.extend(advancedFormat);

const GraphicsPage = () => {
  const [availableSlots, setAvailableSlots] = useState<{ min: number; max: number; remaining: number | null; total: number }>({
    min: 1,
    max: 10,
    remaining: null,
    total: 0,
  });

  const { jwtToken, wallet, client } = useContext(GlobalContext);

  useEffect(() => {
    if (wallet && client && jwtToken) {
      getSlotsAvailable(jwtToken).then((slot) => {
        setAvailableSlots({ min: slot.data.min, max: slot.data.max, remaining: slot.data.remaining, total: slot.data.total });
      });
    }
  }, [wallet, client, jwtToken]);

  return (
    <IonPage>
      <h1 className="page-title">Mining statistics</h1>
      <p className="page-subtitle">Below, you will find statistics about the server usage and your mining performance.</p>

      <IonGrid>
        <IonRow>
          <IonCol>
            <IonCard className="ion-card-alt">
              <IonCardHeader>
                <IonCardTitle className="t-center">Total slots</IonCardTitle>
              </IonCardHeader>

              <IonCardContent className="accent t-center">{availableSlots.total === 0 ? "Loading..." : availableSlots.total}</IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonGrid>
        <IonRow>
          <IonCol>
            <PricingHistory wallet={wallet} />
          </IonCol>
        </IonRow>
      </IonGrid>
      <IonGrid>
        <IonRow>
          <IonCol>
            <MiningHistory wallet={wallet} />
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonPage>
  );
};

export default GraphicsPage;
