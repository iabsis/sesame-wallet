import React from "react";
import { Plan } from "../../services/plans";

export interface ChoosePlanContextType {
  planObject: Plan | null;
  nbSlots: number;
  referral: string;
  setContext: React.Dispatch<React.SetStateAction<ChoosePlanContextType>>;
}

export const initialChoosePlanContext: ChoosePlanContextType = {
  planObject: null,
  nbSlots: 0,
  referral: "",
  setContext: () => null,
};

export const ChoosePlanContext = React.createContext<ChoosePlanContextType>(initialChoosePlanContext);
