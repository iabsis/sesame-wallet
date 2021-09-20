import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import NewAccount from "../components/account-form/NewAccount";
import ExploreContainer from "../components/ExploreContainer";
import "./CreateWallet.css";

const CreateWallet: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>New account</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Create a wallet</IonTitle>
          </IonToolbar>
        </IonHeader>
        <NewAccount />
      </IonContent>
    </IonPage>
  );
};

export default CreateWallet;
