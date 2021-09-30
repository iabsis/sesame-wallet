import { DefaultTheme } from "styled-components";
import tinycolor from "tinycolor2";

export const lightTheme: DefaultTheme = {
  name: "light",
  bg: {
    primary: "#ffffff",
    secondary: "rgba(61, 64, 74, 0.05)",
    tertiary: "rgba(61, 64, 74, 0.2)",
    hover: "rgba(61, 64, 74, 0.035)",
    contrast: "#09122d",
    accent: tinycolor("#D4AA00").setAlpha(0.08).toString(),
  },
  font: {
    primary: "#1b202f",
    secondary: "#797979",
    contrastPrimary: "rgba(255, 255, 255, 1)",
    contrastSecondary: "rgba(255, 255, 255, 0.85)",
  },
  border: {
    primary: "#ebebeb",
    secondary: "#f5f5f5",
  },
  global: {
    accent: "#D4AA00",
    secondary: "#FF5D51",
    alert: "#ed4a34",
    valid: "#4ebf08",
    highlightGradient:
      "linear-gradient(45deg, rgba(18,0,218,1) 0%, rgba(255,93,81,1) 100%)",
  },
};

export const darkTheme: DefaultTheme = {
  name: "dark",
  bg: {
    primary: "#17161b",
    secondary: "rgba(61, 64, 74, 0.05)",
    tertiary: "rgba(61, 64, 74, 0.2)",
    hover: "rgba(61, 64, 74, 0.035)",
    contrast: "#f9122d",
    accent: tinycolor("#D4AA00").setAlpha(0.08).toString(),
  },
  font: {
    primary: "#f2f1ed",
    secondary: "#b9b9b9",
    contrastPrimary: "rgba(0, 0, 0, 1)",
    contrastSecondary: "rgba(0, 0, 0, 0.85)",
  },
  border: {
    primary: "#ebebeb",
    secondary: "#f5f5f5",
  },
  global: {
    accent: "#D4AA00",
    secondary: "#FF5D51",
    alert: "#ed4a34",
    valid: "#4ebf08",
    highlightGradient:
      "linear-gradient(45deg, rgba(18,0,218,1) 0%, rgba(255,93,81,1) 100%)",
  },
};
