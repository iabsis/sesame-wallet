import styled, { css, useTheme } from "styled-components";
import { LucideProps } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface StepDescriptionProps {
  text: string;
  step: number;
}

const variants: Variants = {
  hidden: { y: 10, opacity: 0 },
  shown: { y: 0, opacity: 1 },
};

const StepDescription = ({ text, step }: StepDescriptionProps) => {
  const theme = useTheme();

  return (
    <div className="step-description">
      <span className="step">{step}</span>
      <span className="description">{text}</span>
    </div>
  );
};

export default StepDescription;
