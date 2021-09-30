import { IonBadge } from "@ionic/react";
import dayjs from "dayjs";
import { HTMLMotionProps, motion, Variants } from "framer-motion";
import { FC } from "react";

interface PaymentStatusContext {
  status: string;
}

const PaymentStatusElement: FC<PaymentStatusContext> = ({ status }) => {
  switch (status) {
    case "paid":
      return <div className="label-success with-icon">{status}</div>;
    default:
      return <div className="label-error with-icon">{status}</div>;
  }
};

export default PaymentStatusElement;
