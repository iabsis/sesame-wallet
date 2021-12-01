import axios from "axios";
import { config } from "../config/config";
import { fakeResponse } from "./fakeResponse";
import dayjs from "dayjs";

export type PrebookableSlot = {
  date: Date;
  remaining_slots: number;
  min_slots: number;
  max_slots: number;
  price_per_slot: number;
};

const prebookableSlots = [
  {
    date: dayjs(new Date()).set("date", 1).toDate(),
    remaining_slots: 100,
    min_slots: 1,
    max_slots: 15,
    price_per_slot: 56,
  },
  {
    date: dayjs(new Date()).set("date", 1).add(1, "month").toDate(),
    remaining_slots: 0,
    min_slots: 1,
    max_slots: 15,
    price_per_slot: 56,
  },
  {
    date: dayjs(new Date()).set("date", 1).add(2, "month").toDate(),
    remaining_slots: 34,
    min_slots: 1,
    max_slots: 15,
    price_per_slot: 56,
  },
  {
    date: dayjs(new Date()).set("date", 1).add(3, "month").toDate(),
    remaining_slots: 0,
    min_slots: 1,
    max_slots: 15,
    price_per_slot: 56,
  },
  {
    date: dayjs(new Date()).set("date", 1).add(4, "month").toDate(),
    remaining_slots: 0,
    min_slots: 1,
    max_slots: 15,
    price_per_slot: 56,
  },
  {
    date: dayjs(new Date()).set("date", 1).add(5, "month").toDate(),
    remaining_slots: 100,
    min_slots: 1,
    max_slots: 15,
    price_per_slot: 56,
  },
  {
    date: dayjs(new Date()).set("date", 1).add(6, "month").toDate(),
    remaining_slots: 100,
    min_slots: 1,
    max_slots: 15,
    price_per_slot: 56,
  },
  {
    date: dayjs(new Date()).set("date", 1).add(7, "month").toDate(),
    remaining_slots: 100,
    min_slots: 1,
    max_slots: 15,
    price_per_slot: 56,
  },
  {
    date: dayjs(new Date()).set("date", 1).add(8, "month").toDate(),
    remaining_slots: 100,
    min_slots: 1,
    max_slots: 15,
    price_per_slot: 56,
  },
  {
    date: dayjs(new Date()).set("date", 1).add(9, "month").toDate(),
    remaining_slots: 100,
    min_slots: 1,
    max_slots: 5,
    price_per_slot: 56,
  },
];

export const getPrebookableSlots = (jwtToken?: String): Promise<{ data: PrebookableSlot[] }> => {
  let url = `${config.API_URL}/slots-prebooking`;
  return fakeResponse(prebookableSlots);
  // return axios.get(url, {
  //   headers: {
  //     Authorization: jwtToken,
  //   },
  // });
};
