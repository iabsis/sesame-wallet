import dayjs from "dayjs";

interface CartItemProps {
  selected: boolean;
  month: Date | null;
  nbSlots: number;
}

const CartItem = ({ selected, month, nbSlots }: CartItemProps) => {
  return (
    <div className={`cart-item ${selected ? "selected" : ""}`}>
      {dayjs(month).format("MMMM YY")}
      {selected && <> - {nbSlots} slot(s)</>}
    </div>
  );
};

export default CartItem;
