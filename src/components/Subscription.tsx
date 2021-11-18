import { IonBadge } from "@ionic/react";
import dayjs from "dayjs";
import { HTMLMotionProps, motion, Variants } from "framer-motion";
import { FC } from "react";
import styled from "styled-components";
import { SwitchLink } from "../pages/HomePage";
import { Invoice, Subscription } from "../services/subscriptions";
import { Button } from "./Buttons";
import Checkbox from "./Checkbox";
import PaymentStatusElement from "../components/PaymentStatus";

interface SubscriptionContext {
  subscription: Subscription;
  showInvoices: boolean;
  switchDisplayInvoices: any;
  cancelSubscription: any;
}

const SubscriptionElement: FC<SubscriptionContext> = ({ subscription, showInvoices, switchDisplayInvoices, cancelSubscription }) => {
  const loadInvoice = (invoice: Invoice) => {
    window.open(invoice.pdfInvoiceLink);
  };

  return (
    <div className={`subscription-element ${showInvoices ? "show-invoices" : ""}`}>
      <div className="subscription-row">
        <div className="subscription-name">
          <div>{subscription.plan.name}</div>
          {subscription.renewal ? (
            <div className="label-success with-icon">Auto bill active</div>
          ) : (
            <div className="label-error with-icon">Auto bill cancelled</div>
          )}
        </div>
        <div className="subscription-slots">{subscription.nbSlots} slot(s)</div>
      </div>
      {subscription.referral && <div className="row no-margin small">Referral: {subscription.referral}</div>}
      <div className="row">
        <div className="col-left">
          {subscription.invoices.length > 0 && <Button onClick={switchDisplayInvoices}>{subscription.invoices.length} invoice(s)</Button>}
        </div>
        <div className="col-right">
          <div className="info">
            <div className="soft-text">Subscribed on {dayjs(subscription.requestedAt).format("D MMM, YYYY")}</div>
            {subscription.renewal ? (
              <SwitchLink className="no-margin no-padding" onClick={cancelSubscription}>
                Cancel the renewal
              </SwitchLink>
            ) : null}
          </div>
        </div>
      </div>
      {showInvoices && (
        <ul className="invoices-list textual-list">
          {subscription.invoices &&
            subscription.invoices.length > 0 &&
            subscription.invoices.map((invoice, index) => {
              return (
                <li key={index} className="my-2">
                  <div className="row no-margin">
                    <div className="col-left">
                      <div className="row-title">{invoice.invoiceID}</div>
                    </div>
                    <div className="col-right">
                      <PaymentStatusElement status={invoice.lastPaymentStatus} />
                    </div>
                  </div>
                  <div className="row no-margin">
                    <div className="col-left">
                      <div className="row-subtitle">Invoice on {dayjs(invoice.invoiceDate).format("D MMM, YYYY")}</div>
                    </div>
                    <div className="col-right">
                      <SwitchLink className="no-margin no-padding" onClick={() => loadInvoice(invoice)}>
                        See pdf on stripe
                      </SwitchLink>
                    </div>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default SubscriptionElement;
