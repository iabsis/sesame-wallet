import axios from "axios";
import { config } from "../config/config";
import { fakeResponse } from "./fakeResponse";
import dayjs from "dayjs";

export type PrebookableSlot = {
  date: string;
  dateObject: Date | null;
  remaining_slots: number;
  remaining_days: number;
  min_slots: number;
  max_slots: number;
  price_per_slot: number;
};

// const prebookableSlots = [
//   {
//     date: dayjs(new Date()).set("date", 1).toDate(),
//     remaining_slots: 100,
//     min_slots: 1,
//     max_slots: 15,
//     price_per_slot: 56,
//   },
//   {
//     date: dayjs(new Date()).set("date", 1).add(1, "month").toDate(),
//     remaining_slots: 0,
//     min_slots: 1,
//     max_slots: 15,
//     price_per_slot: 56,
//   },
//   {
//     date: dayjs(new Date()).set("date", 1).add(2, "month").toDate(),
//     remaining_slots: 1,
//     min_slots: 1,
//     max_slots: 15,
//     price_per_slot: 56,
//   },
//   {
//     date: dayjs(new Date()).set("date", 1).add(3, "month").toDate(),
//     remaining_slots: 2,
//     min_slots: 1,
//     max_slots: 15,
//     price_per_slot: 56,
//   },
//   {
//     date: dayjs(new Date()).set("date", 1).add(4, "month").toDate(),
//     remaining_slots: 3,
//     min_slots: 1,
//     max_slots: 15,
//     price_per_slot: 56,
//   },
//   {
//     date: dayjs(new Date()).set("date", 1).add(5, "month").toDate(),
//     remaining_slots: 4,
//     min_slots: 1,
//     max_slots: 15,
//     price_per_slot: 56,
//   },
//   {
//     date: dayjs(new Date()).set("date", 1).add(6, "month").toDate(),
//     remaining_slots: 5,
//     min_slots: 1,
//     max_slots: 15,
//     price_per_slot: 56,
//   },
//   {
//     date: dayjs(new Date()).set("date", 1).add(7, "month").toDate(),
//     remaining_slots: 6,
//     min_slots: 1,
//     max_slots: 15,
//     price_per_slot: 56,
//   },
//   {
//     date: dayjs(new Date()).set("date", 1).add(8, "month").toDate(),
//     remaining_slots: 7,
//     min_slots: 1,
//     max_slots: 15,
//     price_per_slot: 56,
//   },
//   {
//     date: dayjs(new Date()).set("date", 1).add(9, "month").toDate(),
//     remaining_slots: 8,
//     min_slots: 1,
//     max_slots: 5,
//     price_per_slot: 56,
//   },
// ];

export const getPrebookableSlots = (jwtToken?: String): Promise<{ data: PrebookableSlot[] }> => {
  let url = `${config.API_URL}/slots-prebooking`;
  // return fakeResponse(prebookableSlots);
  return axios.get(url, {
    headers: {
      Authorization: jwtToken,
    },
  });
};
