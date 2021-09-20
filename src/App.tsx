import { Redirect, Route, Switch } from "react-router-dom";
import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Home from "./pages/Home";
import CreateWallet from "./pages/CreateWallet";
import {
  createClient,
  loadSettingsOrDefault,
  saveSettings,
  Settings,
} from "./utils/clients";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { Wallet } from "alephium-js";
import React from "react";

interface Context {
  usernames: string[];
  currentUsername: string;
  setCurrentUsername: (username: string) => void;
  wallet?: Wallet;
  setWallet: (w: Wallet | undefined) => void;
  networkId: number;
  client: Client | undefined;
  settings: Settings;
  setSettings: React.Dispatch<React.SetStateAction<Settings>>;
  setSnackbarMessage: (message: SnackbarMessage) => void;
}

const initialContext: Context = {
  usernames: [],
  currentUsername: "",
  setCurrentUsername: () => null,
  wallet: undefined,
  setWallet: () => null,
  networkId: 1,
  client: undefined,
  settings: loadSettingsOrDefault(),
  setSettings: () => null,
  setSnackbarMessage: () => null,
};

interface SnackbarMessage {
  text: string;
  type: "info" | "alert" | "success";
  duration?: number;
}

export const GlobalContext = React.createContext<Context>(initialContext);

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Switch>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/wallet/create">
            <CreateWallet />
          </Route>
          <Route exact path="/">
            <Redirect to="/home" />
          </Route>
        </Switch>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
