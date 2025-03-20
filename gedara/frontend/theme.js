import { MD3LightTheme } from 'react-native-paper';

export const colors = {
  primary: "#121212",
  secondary: "#5e807f",
  background: "#000000",
  text: "#FFFFFF",
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.background,
    text: colors.text,
  },
};
