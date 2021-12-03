import dayjs from "dayjs";
import { FC } from "react";

import { Booking } from "../services/bookings";
import CartItem from "./CartItem";
import PaymentStatusElement from "./PaymentStatus";

interface BookingContext {
  booking: Booking;
}

const BookingElement: FC<BookingContext> = ({ booking }) => {
  return (
    <div className={`booking-element`}>
      <div className="booking-row">
        <div className="booking-name">
          <div>{booking.period.length} month's booking</div>
        </div>
        <div className="booking-slots">
          {" "}
          <PaymentStatusElement status={booking.status} />
        </div>
      </div>
      {booking.referral && <div className="row no-margin small">Referral: {booking.referral}</div>}
      <div className="row no-margin small">Subscribed at: {dayjs(booking.bookedAt).format("MMMM Do, YYYY")}</div>
      <div className="cart-items inline">
        {booking.period &&
          booking.period.length > 0 &&
          booking.period.map((period) => <CartItem selected={true} month={dayjs(period.periodStart).toDate()} nbSlots={period.quantity} />)}
      </div>
    </div>
  );
};

export default BookingElement;
