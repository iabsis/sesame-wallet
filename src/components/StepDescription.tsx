import styled, { css, useTheme } from "styled-components";
import { LucideProps } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface StepDescriptionProps {
  text: string;
  step?: number;
  subtitle?: string;
  className?: string;
}

const variants: Variants = {
  hidden: { y: 10, opacity: 0 },
  shown: { y: 0, opacity: 1 },
};

const StepDescription = ({ text, step, subtitle, className }: StepDescriptionProps) => {
  const theme = useTheme();

  return (
    <div className={`step-description ${className ? className : ""}`}>
      {step && <span className="step">{step}</span>}
      <span className="description">{text}</span>
      {subtitle && <span className="subtitle">{subtitle}</span>}
    </div>
  );
};

export default StepDescription;
