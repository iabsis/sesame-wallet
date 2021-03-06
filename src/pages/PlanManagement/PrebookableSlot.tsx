import { IonIcon } from "@ionic/react";
import dayjs from "dayjs";
import { HTMLMotionProps, motion, Variants } from "framer-motion";
import { FC } from "react";
import styled from "styled-components";
import { PrebookableSlot } from "../../services/slotsPrebooking";
import { play } from "ionicons/icons";

interface PrebookableSlotContext {
  prebookableSlot: PrebookableSlot;
  onClick?: () => void;
}

const PrebookableSlotElement: FC<PrebookableSlotContext> = ({ prebookableSlot, onClick }) => {
  return (
    <div onClick={onClick} className={`prebookable-slot-element bg-primary ${prebookableSlot.remaining_slots < 1 ? "disabled" : ""}`}>
      <div className="prebookable-slot-row">
        <div className="prebookable-slot-name">
          {dayjs(prebookableSlot.date).format("MMMM YYYY")}
          <div className="prebookable-slot-description">
            Avail. slots: <span className="badge badge-success">{prebookableSlot.remaining_slots}</span>
          </div>
          <div className="prebookable-slot-description">
            <span className="">Mining {prebookableSlot.remaining_days} days</span>
          </div>
        </div>
        {prebookableSlot.remaining_slots < 1 ? (
          <button className="prebookable-order-button sold-out" type="button">
            <span className="btn-sold-out">Sold out</span>
          </button>
        ) : (
          <div className="prebookable-slot-price">
            <button className="prebookable-order-button" type="button">
              <div className="vertical">
                <span className="btn-title">{prebookableSlot.price_per_slot.toFixed(2)} CHF</span>
                <span className="btn-little">{(prebookableSlot.price_per_slot / prebookableSlot.remaining_days).toFixed(2)} chf / slot / day</span>
                <span className="btn-main"> </span>
              </div>
              <IonIcon icon={play} className="btn-icon" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrebookableSlotElement;
