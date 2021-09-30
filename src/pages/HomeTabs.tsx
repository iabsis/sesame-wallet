import {
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from "@ionic/react";
import { statsChart, wallet, card } from "ionicons/icons";
import { Redirect, Route } from "react-router";

import WalletPages from "../pages/Wallet/WalletRootPage";
import GraphicsPage from "../pages/GraphicsPage";
import SubscriptionsPage from "../pages/SubscriptionsPage";

const HomeTabs = () => {
  return (
    <IonTabs>
      <IonRouterOutlet id="tabs">
        <Route path="/wallet/dashboard">
          <WalletPages />
        </Route>
        <Route path="/wallet/stats">
          <GraphicsPage />
        </Route>
        <Route path="/wallet/subscriptions">
          <SubscriptionsPage />
        </Route>

        <Route exact path="/wallet">
          <Redirect exact from="/wallet" to="/wallet/dashboard" />
        </Route>
      </IonRouterOutlet>
      <IonTabBar slot="bottom">
        <IonTabButton tab="dashboard" href="/wallet/dashboard">
          <i className="icon icon-wallet"></i>
          <IonLabel>Wallet</IonLabel>
        </IonTabButton>
        <IonTabButton tab="stats" href="/wallet/stats">
          <i className="icon icon-graph"></i>
          <IonLabel>Statistics</IonLabel>
        </IonTabButton>
        <IonTabButton tab="subscriptions" href="/wallet/subscriptions">
          <i className="icon icon-subscription"></i>
          <IonLabel>Subscriptions</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default HomeTabs;
