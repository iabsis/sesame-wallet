import React from "react";
import { Cart } from "../../services/checkout";
import { Plan } from "../../services/plans";
import { PrebookableSlot } from "../../services/slotsPrebooking";

export interface ChoosePlanContextType {
  prebookableSlotObject: PrebookableSlot | null;
  nbSlots: number;
  nbMonths: number;
  referral: string;
  cart: Cart[];
  price: number;
  setContext: React.Dispatch<React.SetStateAction<ChoosePlanContextType>>;
}

export const initialChoosePlanContext: ChoosePlanContextType = {
  prebookableSlotObject: null,
  nbSlots: 0,
  nbMonths: 1,
  referral: "",
  cart: [],
  price: 0,
  setContext: () => null,
};

export const ChoosePlanContext = React.createContext<ChoosePlanContextType>(initialChoosePlanContext);
