import React from "react";
import { Plan } from "../../services/plans";
import { PrebookableSlot } from "../../services/slotsPrebooking";

export interface ChoosePlanContextType {
  prebookableSlotObject: PrebookableSlot | null;
  nbSlots: number;
  referral: string;
  setContext: React.Dispatch<React.SetStateAction<ChoosePlanContextType>>;
}

export const initialChoosePlanContext: ChoosePlanContextType = {
  prebookableSlotObject: null,
  nbSlots: 0,
  referral: "",
  setContext: () => null,
};

export const ChoosePlanContext = React.createContext<ChoosePlanContextType>(initialChoosePlanContext);
