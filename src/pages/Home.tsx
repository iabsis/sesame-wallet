import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { getStorage } from "alephium-js";
import ExploreContainer from "../components/ExploreContainer";
import "./Home.css";

const Storage = getStorage();

const Home: React.FC = () => {
  const usernames = Storage.list();
  const hasWallet = usernames.length > 0;

  //	Initializing router
  const router = useIonRouter();

  if (!hasWallet) {
    router.push("/wallet/create");
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
