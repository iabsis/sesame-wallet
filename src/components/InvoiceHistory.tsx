import { IonButton } from "@ionic/react";
import dayjs from "dayjs";
import { motion, useTransform, useViewportScroll } from "framer-motion";
import styled from "styled-components";
import { Invoice, Subscription } from "../services/subscriptions";
import { deviceBreakPoints } from "../style/globalStyles";

const InvoiceHistory = ({ subscription }: { subscription: Subscription }) => {
  const loadInvoice = (invoice: Invoice) => {
    window.open(invoice.pdfInvoiceLink);
  };

  return (
    <ul>
      {subscription &&
        subscription.invoices.length > 0 &&
        subscription.invoices.map((invoice) => {
          console.log("invoice", invoice);
          return (
            <li>
              Invoice from{" "}
              {dayjs(new Date(invoice.invoiceDate)).format("YYYY-MM-DD")}
              <IonButton onClick={() => loadInvoice(invoice)}>
                View invoice
              </IonButton>
            </li>
          );
        })}
    </ul>
  );
};

export default InvoiceHistory;
