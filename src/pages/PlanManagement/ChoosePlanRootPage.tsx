import React, { useState } from "react";
import {
  ChoosePlanContext,
  ChoosePlanContextType,
  initialChoosePlanContext,
} from "./ChoosePlanContext";
import MultiStepsController from "../MultiStepsController";
import { ReactComponent as AlephiumLogoSVG } from "../../images/alephium_logo_monochrome.svg";
import AppHeader from "../../components/AppHeader";
import { deviceBreakPoints } from "../../style/globalStyles";
import styled from "styled-components";
import ChoosePlanPage from "./ChoosePlanPage";
import ChoosePlanCheckoutPage from "./ChoosePlanCheckoutPage";

const ChoosePlanRootPage = () => {
  const [context, setContext] = useState<ChoosePlanContextType>(
    initialChoosePlanContext
  );

  const choosePlanSteps: JSX.Element[] = [
    <ChoosePlanPage key="choose-plan" />,
    <ChoosePlanCheckoutPage key="choose-plan-checkout" />,
  ];

  return (
    <ChoosePlanContext.Provider value={{ ...context, setContext }}>
      {/* <AppHeader /> */}
      {/* <FloatingLogo /> */}
      <MultiStepsController
        stepElements={choosePlanSteps}
        baseUrl="choose-plan"
      />
    </ChoosePlanContext.Provider>
  );
};

const FloatingLogo = styled(AlephiumLogoSVG)`
  position: absolute;
  top: 50px;
  left: 25px;
  width: 60px;
  height: 60px;

  path {
    fill: rgba(0, 0, 0, 0.05) !important;
  }

  @media ${deviceBreakPoints.mobile} {
    display: none;
  }
`;

export default ChoosePlanRootPage;
