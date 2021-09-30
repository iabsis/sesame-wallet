import { HTMLMotionProps, motion, Variants } from "framer-motion";
import { FC } from "react";
import styled from "styled-components";
import { Plan } from "../../services/plans";
import Checkbox from "../../components/Checkbox";

interface PlanContext {
  plan: Plan;
  selected: boolean;
  onClick?: () => void;
}

const PlanElement: FC<PlanContext> = ({ plan, selected, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`plan-element ${selected ? "selected" : ""}`}
    >
      <div className="plan-row">
        <div className="plan-name">
          <Checkbox checked={selected} />
          {plan.name}
        </div>
        <div className="plan-price">{plan.pricePerSlot} chf / slot</div>
      </div>
      <ul className="plan-description">
        {plan.description &&
          plan.description.length > 0 &&
          plan.description.map((description, index) => {
            return <li key={index}>{description}</li>;
          })}
      </ul>
    </div>
  );
};

export default PlanElement;
