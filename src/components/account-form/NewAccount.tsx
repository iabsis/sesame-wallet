import {
  IonContent,
  IonPage,
  IonText,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonRange,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import React, { useRef } from "react";
import { Controller, useForm } from "react-hook-form";

const NewAccount: React.FC = () => {
  const { handleSubmit, control, watch } = useForm();
  const password = useRef({});
  password.current = watch("password", "");

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <IonItem>
        <IonLabel>Username</IonLabel>
        <Controller
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
            formState,
          }) => (
            <>
              <IonInput onIonChange={onChange} />
              {invalid && error && error.message && (
                <div className="error">{error.message}</div>
              )}
            </>
          )}
          control={control}
          name="username"
          rules={{
            required: true,
            pattern: {
              value: /^.{3,}$/i,
              message: "Please enter a valid username",
            },
          }}
        />
      </IonItem>
      <IonItem>
        <IonLabel>Password</IonLabel>
        <Controller
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
            formState,
          }) => (
            <>
              <IonInput onIonChange={onChange} />
              {invalid && error && error.message && (
                <div className="error">{error.message}</div>
              )}
            </>
          )}
          control={control}
          name="password"
          rules={{
            required: true,
            pattern: {
              value: /^.{3,}$/i,
              message: "Please enter a valid password",
            },
          }}
        />
      </IonItem>
      <IonItem>
        <IonLabel>Confirm password</IonLabel>
        <Controller
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { invalid, isTouched, isDirty, error },
            formState,
          }) => (
            <>
              <IonInput onIonChange={onChange} />
              {invalid && error && error.message && (
                <div className="error">{error.message}</div>
              )}
            </>
          )}
          control={control}
          name="confirmPassword"
          rules={{
            validate: (value) =>
              value === password.current || "The passwords do not match",
            required: true,
            pattern: {
              value: /^.{3,}$/i,
              message: "Please enter a valid password",
            },
          }}
        />
      </IonItem>

      <IonButton type="submit">submit</IonButton>
    </form>
  );
};
export default NewAccount;
