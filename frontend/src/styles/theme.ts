import { ThemeConfig, extendTheme } from "@chakra-ui/react";
import { colors } from "@/styles/colors";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false
};

const theme = extendTheme({
  colors,
  config,
  styles: {
    global: {
      "*": {
        "&::-webkit-scrollbar": {
          w: "2",
          h: "1.5"
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#A0A0A0"
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#606060",
          borderRadius: "4"
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#505050"
        }
      }
    }
  }
});

export default theme;
